    /**
 * Created by sun on 2016/9/9.
 */

define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    app.useModule("ui.table");
    var datepicker = require('datepicker');
    var toastr =require('toastr');
    app.controller('cfgResourceCtrl', ['$scope','$http',function ($scope, $http) {
        datepicker($scope);
        $scope.maxSize=5;
        $scope.cfgResourceSearchEntity = {page:1,pageSize:10};
        $scope.query=function(reset){
            if(reset)
                $scope.cfgResourceSearchEntity = {page:1,pageSize:10};
            $http({
                method: 'POST',
                url: "hasan/config/resources",
                data:$scope.cfgResourceSearchEntity
            }).success(function(data) {
                console.log(data);
                $scope.cfgResourceList=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            });
        };
        $scope.query();

        // 切换页码时
        $scope.changePages=function(){
            $scope.cfgResourceSearchEntity.page = $scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            $scope.query();
        };
        //全局查询重置
        $scope.reset=function(){
            $scope.query(true);
        };

        //创建
        $scope.addFileTypeModal=function(){
            $scope.isAdd = true;
            $scope.fileTypeModal = !$scope.fileTypeModal ;
            $scope.fileType={};
        };
        $scope.submit = function() {
            $http({
                method: 'POST',
                url:"hasan/config/resource/edit",
                data:$scope.fileType
            }).success(function(data) {
                if(data.code=="code.success"){
                    toastr.success("提交成功！");
                    $scope.fileTypeModal = !$scope.fileTypeModal;
                    $scope.query();
                }
            });
        };
        //编辑
        $scope.update = function(item){
            $scope.isAdd = false;
            $scope.fileType=item;
            $scope.fileTypeModal = !$scope.fileTypeModal ;
        };

        //删除
        $scope.delete = function(id){
            if(confirm("确认要删除吗？")) {
                $http({
                    method: 'POST',
                    url: "hasan/config/resource/delete",
                    data: {id: id}
                }).success(function (data) {
                    if (data.code == 'code.success') {
                        $scope.query();
                        toastr.success("删除成功！");
                    }
                });
            }
        };
    }]);
});