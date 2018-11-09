/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    app.useModule("ui.table");
    var toastr =require('toastr');
    var datepicker = require('datepicker');
    require('ztree');
    app.controller('roleCtrl', ['$scope','$http',function ($scope, $http) {
        datepicker($scope);
        $scope.checked=[];
        $scope.resources=[];
        $scope.setting = {
            view: {
                selectedMulti: false
            },
            check: {
                enable: true,
                chkStyle: "checkbox",
                chkboxType: { "Y": "p", "N": "s" }
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
            }
        };
        //******************查询权限**************
        var roleSearchEntity = {page:1,pageSize:10};
        $scope.query = function (reset) {
            if(reset){
                roleSearchEntity = {page:1,pageSize:10};
            }
            $http({
                method: 'POST',
                url: "hasan/authority/role/list",
                data:roleSearchEntity
            }).success(function (data) {
                console.log(data);
                $scope.orderParams=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            })
        };
        $scope.query(true);

        // 切换页码时
        $scope.changePages=function(){
            roleSearchEntity.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            roleSearchEntity = {page:1,pageSize:10};
            if($scope.roleName)
                roleSearchEntity.name = $scope.roleName;
            $scope.query();
        };
        //创建
        $scope.addOrderModal=function(){
            $scope.isEdit = false;
            $scope.role={};
            $scope.orderModal = !$scope.orderModal;
            $scope.resource();
        };
        //修改
        $scope.openViewOrderModal=function(id){
            $scope.isEdit = true;
            $scope.orderModal = !$scope.orderModal;
            $scope.resource(id);
        };

        //显示所有复选框
        $scope.resource=function(item){
            //打开的是新增窗口
            $http({
                method: 'POST',
                url: "hasan/authority/modular/list",
                data:{}
            }).success(function (data) {
                if(data.code=='code.success'){
                    $.fn.zTree.init($("#treeDemo"), $scope.setting, data.attach);
                    if(item){//如果是更新就查找对应栏目权限
                        $http({
                            method: 'POST',
                            url: "hasan/authority/role/list/modular",
                            data:{id:item.id}
                        }).success(function (data) {
                            console.log(data);
                            $scope.role = item;
                            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                            for(var i=0;i<data.attach.length;i++){
                                if(treeObj.getNodeByParam("id",data.attach[i].id))
                                    treeObj.checkNode(treeObj.getNodeByParam("id",data.attach[i].id),true);
                            }
                        });
                    }
                }
            });
        };

        //添加编辑
        $scope.editRole=function(){
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.getCheckedNodes(true);
            $scope.role.ids = [];
            for(var i= 0 ;i<nodes.length;i++){
                $scope.role.ids.push(nodes[i].id);
            }
            if($scope.isEdit){
                $scope.url="hasan/authority/role/modify";
            }else{
                $scope.url="hasan/authority/role/add";
            }
            $http({
                method: 'POST',
                url: $scope.url,
                data:$scope.role
            }).success(function (data) {
                if(data.code=='code.success'){
                    console.log(data);
                    toastr.success('提交成功');
                    $scope.orderModal = !$scope.orderModal;
                    window.location.reload();
                }
            });
        };

        //删除
        $scope.delete=function (id) {
            if (confirm("确认要删除吗")) {
                $http({
                    method: 'POST',
                    url: "hasan/authority/role/delete",
                    data:{id:id}
                }).success(function (data) {
                    if(data.code=='code.success'){
                        toastr.success("删除成功！");
                        $scope.query();
                    }
                });
            }else {
                return;
            }
        }
    }]);
});