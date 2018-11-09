define(function (require) {
    var app = require('/../js/app');
    require('ui-table');
    var toastr =require('toastr');
    app.useModule("ui.table");
    var datepicker = require('datepicker');
    app.controller('indexCtrl', ['$scope','$http','$rootScope',function ($scope,$http,$rootScope) {
        $scope.test = {};
        console.log($scope.test);
    }]);
});