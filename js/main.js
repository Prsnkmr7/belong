belongBuild = angular.module('belong-app', ['ui.router']);

// Route Provider Starts

belongBuild.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('Home', {
            url: '/',
            templateUrl: 'Templates/home.html'
        })
        
});

// Home Controller logic

belongBuild.controller('homeController', ['$scope', 'belongAPIservice', function ($scope, belong) {
    $scope.orderByField = '';
    $scope.reverseSort = false;
    $scope.numberOfItemSelected = 0;
    $scope.listItems = [];
    var prev;
    $scope.user = {};
    $scope.init = function () {
        if (!sessionStorage.user) {
            belong.listAllItems().success(function (response) {
                $scope.listItems = response.memberDetails;
                storageToSession();
            });
        }
        else{
            retreiveSessionData();
            
        }
    };

    var retreiveSessionData = function () {
        $scope.listItems = JSON.parse(sessionStorage.user);
        $scope.numberOfItemSelected = sessionStorage.numberOfItemSelected;
        $scope.allChecked = JSON.parse(sessionStorage.allChecked);
    };

    var storageToSession = function () {
        sessionStorage.user = JSON.stringify($scope.listItems);
        sessionStorage.numberOfItemSelected = $scope.numberOfItemSelected;
        sessionStorage.allChecked = JSON.stringify($scope.allChecked);
    };

    $scope.sort = function (order, val) {
        $scope.orderByField = val;
        $scope.reverseSort = order;
    };

    $scope.showEditDel = function (val, id) {
        $scope.showdata = val;
        $scope.togglehide = true;
        if (id === prev) {
            $scope.togglehide = false;
        }
        prev = id;
    };

    $scope.showDropDown = function (val) {
        if ($scope.showValueDropdown == val) {
            $scope.showValueDropdown = '';
        } else {
            $scope.showValueDropdown = val;
        }
    };

    $scope.toggleAll = function () {
        $scope.allChecked = event.target.checked;
        angular.forEach($scope.listItems, function (itm) { itm.selected = $scope.allChecked; });
        $scope.selectList();
        storageToSession();
    };

    $scope.selectList = function () {
        var i;
        $scope.numberOfItemSelected = 0;
        for (i = 0; i < $scope.listItems.length; i++) {
            if ($scope.listItems[i].selected == true) {
                $scope.numberOfItemSelected++;
            }
        }
    };

    $scope.ChnageSelected = function (val) {
        val.selected = event.target.checked;
        if (val.selected === false) {
            $scope.allChecked = false;
        }
        $scope.selectList();
        storageToSession();
    };

    $scope.removeDefault = function () {
        $scope.showValueDropdown = '';
        $scope.togglehide = false;
    };

    $scope.togglePopup = function (val) {
        $scope.addMember = val;
    };

    $scope.submitForm = function (val) {
        if (val) {
            var data = {
                "id": $scope.user.name,
                "name": $scope.user.name,
                "company": $scope.user.company,
                "notes": $scope.user.note,
                "status": $scope.user.status,
                "lastUpdated": "5/12/2018"
            };
            $scope.listItems.push(data);
            $scope.togglePopup(false);
            $scope.clearData();
            storageToSession();
        }
    };

    $scope.delete = function (val) {
        var index = $scope.listItems.indexOf(val);
        $scope.listItems.splice(index, 1);
        storageToSession();
    };

    $scope.clearData = function () {
        $scope.user.name = '';
        $scope.user.company = '';
        $scope.user.note = '';
        $scope.user.status = '';
    };

    $scope.init();

}]);

// Factories

belongBuild.factory('belongAPIservice', function ($http) {

    var belongAPI = {};

    belongAPI.listAllItems = function () {
        return $http({
            method: 'GET',
            url: '../json/member.json'
        });
    }

    return belongAPI;
});