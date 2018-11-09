/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    app.useModule("ui.table");
    var toastr =require('toastr');
    var datepicker = require('datepicker');
    app.controller('dateCtrl', ['$scope','$http','enums','$filter',function ($scope, $http,enums,$filter) {
        datepicker($scope);
        $scope.schedulerType = enums.schedulerType;
        $scope.query = function (reset) {
            if(reset){
                $scope.dateSearchEntity = {page:1,pageSize:10};
            }
            $http({
                method: 'POST',
                url: "hasan/scheduler/list",
                data:$scope.dateSearchEntity
            }).success(function (data) {
                console.log(data);
                $scope.orderParams=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            })
        };
        $scope.query(true);

        // 切换页码时
        $scope.changePages=function(){
            $scope.dateSearchEntity.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            $scope.query();
        };
        //条件查询
        $scope.reset=function(){
            $scope.query(true);
        };
        //创建
        $scope.add=function(){
            $scope.isEdit = false;
            $scope.scheduler = {};
            $scope.addModal = !$scope.addModal;
        };
        //修改
        $scope.editApi=function(item){
            $scope.isEdit = true;
            $scope.addModal = !$scope.addModal;
            $scope.scheduler = item;
            //$scope.scheduler.type = enums.getEntity("schedulerType",$scope.scheduler.type).value;
            $scope.scheduler.range = $filter('minutesFilter')($scope.scheduler.start)+" - "+$filter('minutesFilter')($scope.scheduler.stop)
        };

        //添加编辑
        $scope.submitScheduler=function(){
            // $scope.scheduler.day = new Date(Date.parse($scope.scheduler.day)).getDate();
            var range = $scope.scheduler.range.split("-");
            $scope.scheduler.start = Number(range[0].split(":")[0])*60+Number(range[0].split(":")[1]);
            $scope.scheduler.stop = Number(range[1].split(":")[0])*60+Number(range[1].split(":")[1]);
            if($scope.isEdit){
                $scope.url="hasan/scheduler/modify";
            }else{
                $scope.url="hasan/scheduler/add";
            }
            $http({
                method: 'POST',
                url: $scope.url,
                data:$scope.scheduler
            }).success(function (data) {
                if(data.code=='code.success'){
                    console.log(data);
                    toastr.success('提交成功');
                    $scope.addModal = !$scope.addModal;
                    $scope.query();
                }
            });
        };
        //删除
        $scope.delete=function (id) {
            if (confirm("确认要删除吗")) {
                $http({
                    method: 'POST',
                    url: "hasan/scheduler/delete",
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