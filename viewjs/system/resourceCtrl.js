/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    require('ztree');
    require('multiselect');
    var toastr =require('toastr');
    app.useModule("ui.table");
    app.controller('resourceCtrl', ['$scope','$http',function ($scope, $http) {
        $scope.setting = {
            view: {
                selectedMulti: false
            },
            check: {
                enable: false
            },
            data: {
                key:{
                    name:"name"
                },
                simpleData: {
                    enable: true,
                    idKey:"id",
                    pIdKey:"parent"
                }
            },
            edit: {
                enable: true,
                showRenameBtn: false
            },
            callback: {
                beforeRemove:zTreeBeforeRemove,
                onClick: zTreeOnClick

            }
        };

        //删除栏目节点前的操作
        function zTreeBeforeRemove(treeId, treeNode) {
            if(confirm("确认要删除该栏目以及其子栏目吗？")){
                var ids = [];
                ids.push(treeNode.id);
                if(treeNode.isParent)
                    for(var i = 0 ;i<treeNode.children.length;i++)
                        ids.push(treeNode.children[i].id);
                $http({
                    method: 'POST',
                    url: "hasan/authority/modular/delete",
                    data:{ids:ids}
                }).success(function (data) {
                    if(data.code == 'code.success'){
                        toastr.success("删除成功");
                        return true;
                    }else{
                        return false;
                    }
                });
            }else{
                return false;
            }
        }

        //获取后台栏目列表
        var resources = [];
        $http({
            method: 'POST',
            url: "hasan/authority/modular/list",
            data:{}
        }).success(function (data) {
            console.log(data);
            if(data.code == 'code.success'){
                for(var i = 0;i<data.attach.length;i++){
                    var resource = data.attach[i];
                    // if(resource.parent == 0){
                    //     resource.isParent = true;
                    // }
                    resources.push(resource);
                }
                $(document).ready(function () {
                    $.fn.zTree.init($("#treeDemo"), $scope.setting, resources);
                });
            }
        });
        var selectedNode;
        function zTreeOnClick(event,treeId,treeNode) {
            selectedNode = {
                id:treeNode.id,
                name:treeNode.name,
                url:treeNode.url,
                priority:treeNode.priority,
                parent:treeNode.parent==null?0:treeNode.parent,
                css:treeNode.css
            };
            $("#id").val(selectedNode.id);
            $("#name").val(selectedNode.name);
            $("#url").val(selectedNode.url);
            $("#priority").val(selectedNode.priority);
            $("#parent").val(selectedNode.parent);
            $("#css").val(selectedNode.css);
            $("#resource").show();
            $scope.apiAuthInit(treeNode);
        }

        //提交修改
        $scope.resourceModify = function(){
            selectedNode.name = $("#name").val();
            selectedNode.parent = $("#parent").val();
            selectedNode.url = $("#url").val();
            selectedNode.priority = $("#priority").val();
            selectedNode.css = $("#css").val();
            $http({
                method: 'POST',
                url: "hasan/authority/modular/modify",
                data: selectedNode
            }).success(function(data) {
                console.log(data);
                if(data.code=='code.success'){
                    toastr.success("提交成功");
                    window.location.reload();
                }
            });
        };
        $scope.resourceAdd = function () {
            $scope.resourceAddModal = !$scope.resourceAddModal
        };
        $scope.add = {};
        $scope.resourceAddSubmit = function () {
            $http({
                method: 'POST',
                url: "hasan/authority/modular/add",
                data: $scope.add
            }).success(function(data) {
                console.log(data);
                if(data.code=='code.success'){
                    toastr.success("提交成功");
                    window.location.reload();
                }
            });
        };
        /***********multiselect 模块开始************/
        $scope.leftApiList = [];
        var sid="";
        $scope.apiAuthInit = function(treeNode) {
            $http({
                method: 'POST',
                url: "hasan/authority/api/list",
                data:{}
            }).success(function (data) {
                $scope.leftApiList=data.attach.list;
            });
            sid = treeNode.id;
            $("#apiAuth").show();
            $scope.$apply(function () {
                $scope.authResource = treeNode.name;
                //获取模块API操作权限
                $http({
                    method: 'POST',
                    url: "hasan/authority/api/list/modular",
                    data:{id:sid}
                }).success(function (data) {
                    $scope.rightApiList=data.attach.list;
                    for(var i=0;i<$scope.leftApiList.length;i++){
                        for(var j=0;j<$scope.rightApiList.length;j++){
                            if($scope.rightApiList[j].id == $scope.leftApiList[i].id){
                                $scope.leftApiList.splice(i,1);
                                i--;
                                break;
                            }
                        }
                    }
                });
            });
        };
        $('#multiselect1').multiselect({
            keepRenderingSort: true,
            afterMoveToRight:function ($left, $right, $options) {
                $scope.apiAuth($right);
            },
            afterMoveToLeft:function ($left, $right, $options) {
                $scope.apiAuth($right);
            }
        });
        //分配权限
        $scope.apiAuth = function ($right) {
            var tid = [];
            for(var i = 0;i<$right[0].children.length;i++){
                tid.push(Number($right[0].children[i].value));
            }
            $http({
                method: 'POST',
                async:false,
                url: "hasan/authority/auth/modular",
                data:{sid:sid,tid:tid}
            }).success(function (data) {
            });
        }
    }]);
});