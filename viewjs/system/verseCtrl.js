/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    app.useModule("ui.table");
    var toastr =require('toastr');
    var datepicker = require('datepicker');
    app.controller('verseCtrl', ['$scope','$http','enums',function ($scope, $http,enums) {
        datepicker($scope);
        $scope.query = function (reset) {
            if(reset){
                $scope.verseSearchEntity = {page:1,pageSize:10};
            }
            $http({
                method: 'POST',
                url: "hasan/common/verses",
                data:$scope.verseSearchEntity
            }).success(function (data) {
                console.log(data);
                $scope.orderParams=data.attach.list;
                $scope.bigTotalItems=data.attach.total;
            })
        };
        $scope.query(true);

        // 切换页码时
        $scope.changePages=function(){
            $scope.verseSearchEntity.page=$scope.page;
            $scope.query();
        };
        //条件查询
        $scope.search=function(){
            $scope.query();
        };
        //创建
        $scope.add=function(){
            $scope.isEdit = false;
            $scope.verse={};
            $scope.verseModal = !$scope.verseModal;
        };
        //修改
        $scope.update=function(item){
            $scope.isEdit = true;
            $scope.verse = item;
            $scope.verseModal = !$scope.verseModal;
        };

        //添加或修改
        $scope.submitVerse=function(){
            if($scope.isEdit){
                $scope.url="hasan/common/verse/modify";
                $scope.verse.name = $scope.verse.content;
            }else{
                $scope.url="hasan/common/verse/add";
                $scope.verse.id = $scope.verse.content;
            }
            $http({
                method: 'POST',
                url: $scope.url,
                data:$scope.verse
            }).success(function (data) {
                if(data.code=='code.success'){
                    console.log(data);
                    $scope.verse.id = data.attach;
                    toastr.success('提交成功');
                    $scope.verseModal = !$scope.verseModal;
                    $scope.query();
                }
            });
        };
        //删除
        $scope.delete=function (id) {
            if (confirm("确认要删除吗")) {
                $http({
                    method: 'POST',
                    url: "hasan/common/verse/delete",
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