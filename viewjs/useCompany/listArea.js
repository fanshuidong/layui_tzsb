/**
 * Created by sun on 2016/8/4.
 */
define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    var toastr =require('toastr');
    app.useModule("ui.table");
    app.controller('useCompanyListAreaCtrl', ['$scope','$rootScope','$http','enums','DateUtil',function ($scope,$rootScope,$http,enums,DateUtil) {
        $scope.selectOptions = {
            allowClear: false,
            language : 'zh-CN'
        };
        $scope.query=function(reset){
            if(reset){
                $scope.searchEntity = {"page":1,"pageSize":10,"region":1001000000000}
            }
            $http({
                method: 'POST',
                url: "eep/company/list/use/area",
                data:$scope.searchEntity
            }).success(function(data) {
                console.log(data);
                $scope.list = data.attach.list;
                $scope.initPage("page",data.attach.total,$scope.searchEntity);
            });
        };
        $scope.query(true);

        //条件查询
        $scope.search=function(){
            if($scope.start)
                $scope.searchEntity.timeStart = Date.parse($scope.start)/1000;
            else{
                delete  $scope.searchEntity.timeStart
            }
            if($scope.end)
                $scope.searchEntity.timeStop = Date.parse($scope.end)/1000;
            else{
                delete  $scope.searchEntity.timeStop
            }
            $scope.query();
        };
        //刷新
        $scope.refresh = function () {
            $scope.query(true);
        };
        $scope.add  = function () {
            $scope.index = openDomLayer("新增使用单位","useCompany",['1000px','600px']);
            $scope.useCompany = {};
            $scope.isAdd = true;
            myCity.get(myFun);
        };
        $scope.edit  = function (item) {
            $scope.index = openDomLayer("编辑使用单位","useCompany",['1000px','600px']);
            $scope.useCompany = {};
            for(var index in item)
                $scope.useCompany[index] = item[index];
            $scope.useCompany.registerTime = DateUtil.getFormateDate(new Date($scope.useCompany.registerTime*1000));
            $scope.isAdd = false;
            myCity.get(myFun);
        };
        $scope.delete = function () {
            layer.confirm("确认删除该条记录吗？",function () {
                
            })  
        };
        $scope.submit = function () {
            $scope.useCompany.registerTime = Date.parse($scope.useCompany.registerTime)/1000;
            $http({
                method: 'POST',
                url: $scope.isAdd?"sem/company/create/use":"sem/company/modify/use",
                data:$scope.useCompany
            }).success(function(data) {
                if(data.code === $rootScope.successCode){
                    toastr.success("操作成功!");
                    layer.closeAll();
                    $("#useCompany").hide();
                    $scope.query();
                }
            });
        };

        // 百度地图API功能
        var map = new BMap.Map("allMap");
        var point = new BMap.Point(116.331398,39.897445);
        map.centerAndZoom(point,12);
        function myFun(result){
            var cityName = result.name;
            map.setCenter(cityName);
            // alert("当前定位城市:"+cityName);
        }
        var myCity = new BMap.LocalCity();

        $scope.searchMap = function () {
            var local = new BMap.LocalSearch(map, {
                renderOptions:{map: map,panel:"r-result"}
            });
            local.setPageCapacity(5);
            local.setResultsHtmlSetCallback(function(result) {
                /*返回最近一次检索的结果*/
                var data = local.getResults();
                $.each($("ol li"), function (index, domEle) {
                    /*删除电话一行*/
                    $(this).find("div div").each(function () {
                        var bs = $(this).find("b").text();
                        if (bs == "电话:") {
                            $(this).remove();
                        }
                    });
                    /*删除详情*/
                    $(this).find("a").each(function () {
                        if ($(this).text() == "详情»") {
                            $(this).remove();
                        }
                    });
                    /*搜索结果的单行的点击事件*/
                    $(this).bind("click", function () {
                        var thisObj = data.Br[index];
                        if (thisObj) {
                            $scope.useCompany.latitude = thisObj.point.lat;
                            $scope.useCompany.longitude = thisObj.point.lng;
                            $scope.$apply();
                        }
                    });
                });
                /*$.each end*/
            });
            local.search($scope.mapAtr);
        };

        //分页 laypage
        $scope.initPage = function(id,count,entity) {
            layui.use('laypage', function(){
                var laypage = layui.laypage;
                //执行一个laypage实例
                laypage.render({
                    elem: id, //注意，这里的 test1 是 ID，不用加 # 号
                    count: count, //数据总数，从服务端得到
                    limit:entity.pageSize,
                    limits:[entity.pageSize, 20, 30, 40, 50],
                    curr:entity.page,
                    groups:5,
                    layout:['count','prev', 'page', 'next','limit','refresh','skip'],
                    jump: function(obj, first){
                        //首次不执行
                        if(!first){
                            entity.page=obj.curr;
                            $scope.query();
                        }
                    }
                });
            });
        };

    }]);
});