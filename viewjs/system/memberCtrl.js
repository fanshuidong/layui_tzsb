/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    app.useModule("ui.table");
    var toastr =require('toastr');
    var datepicker = require('datepicker');
    app.controller('memberCtrl', ['$scope','$http','enums',function ($scope, $http,enums) {
        datepicker($scope);
        $scope.timeUnit = enums.timeUnit;
        $scope.query = function (reset) {
            if(reset){
                $scope.memberSearchEntity = {page:1,pageSize:10};
            }
            $http({
                method: 'POST',
                url: "hasan/common/members",
                data:$scope.memberSearchEntity
            }).success(function (data) {
                console.log(data);
                $scope.orderParams=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            })
        };
        $scope.query(true);

        // 切换页码时
        $scope.changePages=function(){
            $scope.memberSearchEntity.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            $scope.query();
        };
        //创建
        $scope.add=function(){
            $scope.isEdit = false;
            $scope.member={countLimit:0};
            $scope.memberModal = !$scope.memberModal;
        };
        //修改
        $scope.update=function(item){
            $scope.isEdit = true;
            $scope.memberModal = !$scope.memberModal;
            $scope.member={};
            for(var i in item)
                $scope.member[i] = item[i];
            $scope.member.sale = String($scope.member.sale);
            //$scope.member.timeUnit = enums.getEntity("timeUnit",$scope.member.timeUnit).value;
        };

        //添加编辑
        $scope.submitMember=function(){
            if($scope.isEdit){
                $scope.url="hasan/common/member/modify";
            }else{
                $scope.url="hasan/common/member/add";
            }
            $http({
                method: 'POST',
                url: $scope.url,
                data:$scope.member
            }).success(function (data) {
                if(data.code=='code.success'){
                    console.log(data);
                    toastr.success('提交成功');
                    $scope.memberModal = !$scope.memberModal;
                    $scope.query();
                }
            });
        };
        //删除
        $scope.delete=function (id) {
            if (confirm("确认要删除吗")) {
                $http({
                    method: 'POST',
                    url: "hasan/authority/api/delete",
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