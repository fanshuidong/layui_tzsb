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
    app.controller('districtsCtrl', ['$scope','$http',function ($scope, $http) {
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
            },
            edit: {
                enable: false,
                showRenameBtn: false
            },
            callback: {
                onCheck: zTreeOnCheck
            }
        };

        $scope.setting2 = {
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
            }
        };

        //获取是所有行政区划
        $http({
            method: 'POST',
            url: "sem/popedom/chain",
            data:{}
        }).success(function (data) {
            console.log(data);
            if(data.code === 'code.success'){
                $.fn.zTree.init($("#treeDemo"), $scope.setting, data.attach);
                $http({
                    method: 'POST',
                    url: "sem/popedom/chain",
                    data:{}
                }).success(function (data) {
                    if(data.code === 'code.success'){
                        expand(data.attach);//展开已分配城市
                        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                        var nodes = treeObj.getNodes();
                        for (var i = 0; i < nodes.length; i++) { //设置节点展开
                            treeObj.expandNode(nodes[i], true, false, true);
                        }
                        for(var i=0;i<data.attach.length;i++){
                            if(treeObj.getNodeByParam("id",data.attach[i].id))
                                treeObj.checkNode(treeObj.getNodeByParam("id",data.attach[i].id),true);
                        }
                    }
                });
            }
        });

        //展开
        function expand(data) {
            $.fn.zTree.init($("#treeDemo2"), $scope.setting2, data);
            var treeObj2 = $.fn.zTree.getZTreeObj("treeDemo2");
            var nodes2 = treeObj2.getNodes();
            for (var i = 0; i < nodes2.length; i++) { //设置节点展开
                treeObj2.expandNode(nodes2[i], true, true, true);
            }
        }

        function zTreeOnCheck(event, treeId, treeNode) {
            $http({
                method: 'POST',
                url: "hasan/geo/districts/modify",
                data:{id:treeNode.code,valid:treeNode.checked}
            }).success(function (data) {
                if(data.code=='code.success'){
                    console.log(data);
                    $http({
                        method: 'POST',
                        url: "hasan/geo/districts",
                        data:{}
                    }).success(function (data) {
                        if(data.code == 'code.success'){
                            expand(data.attach);//展开已分配城市
                        }
                    });
                    //toastr.success('提交成功');
                    //window.location.reload();
                }
            });
        }

    }]);
});