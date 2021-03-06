var app = angular.module("multifundadores", ["ngTable"]);

app.service('TableService', function ($http, $filter) {

    function filterData(data, filter){
        return $filter('filter')(data, filter)
    }

    function orderData(data, params){
        return params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
    }

    function sliceData(data, params){
        return data.slice((params.page() - 1) * params.count(), params.page() * params.count())
    }

    function transformData(data,filter,params){
        return sliceData( orderData( filterData(data,filter), params ), params);
    }
    var service = {
        cachedData:[],
        getTable:function($defer, params, filter, data){

            if(service.cachedData.length>0){
                service.cachedData = data;
                var filteredData = filterData(service.cachedData,filter);
                var transformedData = sliceData(orderData(filteredData,params),params);
                params.total(filteredData.length)
                $defer.resolve(transformedData);
            }
            else
            {
                angular.copy(data,service.cachedData)
                params.total(data.length)
                var filteredData = $filter('filter')(data, filter);
                var transformedData = transformData(data,filter,params)
                $defer.resolve(transformedData);
            }
        }
    };
    return service;

});

app.config(["$routeProvider", function($router)
{
    $router
        .when("/propiedades", {
            templateUrl: "/templates/propietarios/content.html"
        })
        .when("/ver/pagos/:id", {
            templateUrl: "/templates/propietarios/propiedad_pagos.html"
        })
        .when("/ver/abonos/:id", {
            templateUrl: "/templates/propietarios/pago_abonos.html"
        })
        .otherwise({
            redirectTo: '/propiedades'
        });
}]);

app.controller("PropietarioController", [
    '$scope', '$http', '$filter', 'ngTableParams', 'TableService', '$timeout', function($scope, $http, $filter, ngTableParams, TableService, $timeout)
    {
        $scope.propiedades = [], $scope.total=0, $scope.pagos = [];

        $scope.listar = function(page)
        {
            $http.get('/propietarios/propiedades/'+session)
                .success(function(data, status, headers, config)
                {
                    console.log(data);
                    $scope.propiedades = $scope.propiedades.concat(data);
                    $scope.total=$scope.propiedades.length;
                    $scope.tableParams = new ngTableParams({page:1, count:10, sorting: { id: 'asc'}}, {
                        total: $scope.propiedades.length,
                        getData: function($defer, params)
                        {
                            TableService.getTable($defer,params,$scope.filter, $scope.propiedades);
                        }
                    });
                    $scope.tableParams.reload();
                    $scope.$watch("filter.$", function () {
                        $scope.tableParams.reload();
                    });
                });
        };
        $scope.listar();
    }]);

app.controller("PagosController", ['$scope', '$http', '$filter', 'ngTableParams', 'TableService', '$timeout', '$routeParams',
    function($scope, $http, $filter, ngTableParams, TableService, $timeout,$routeParams)
{
    $scope.pagos = [], $scope.total=0, $scope.propiedad_id = $routeParams.id;

    $scope.verPagos = function()
    {
        $http.get('/propiedad/ver/'+$routeParams.id)
            .success(function(data, status, headers, config)
            {
                $scope.pagos = $scope.pagos.concat(data.pagos);
                $scope.total=$scope.pagos.length;
                $scope.tableParams = new ngTableParams({page:1, count:10, sorting: { id: 'asc'}}, {
                    total: $scope.pagos.length,
                    getData: function($defer, params)
                    {
                        TableService.getTable($defer,params,$scope.filter, $scope.pagos);
                    }
                });
                $scope.tableParams.reload();
                $scope.$watch("filter.$", function () {
                    $scope.tableParams.reload();
                });
            });
    };
    $scope.verPagos();
}]);


app.controller("AbonosController", ['$scope', '$http', '$filter', 'ngTableParams', 'TableService', '$timeout', '$routeParams',
    function($scope, $http, $filter, ngTableParams, TableService, $timeout,$routeParams)
    {
        $scope.abonos = [], $scope.total=0, $scope.pago_id= $routeParams.id;

        $scope.verAbonos = function()
        {
            $http.get('/propietarios/abonos/pago/'+$routeParams.id)
                .success(function(data, status, headers, config)
                {
                    $scope.abonos = $scope.abonos.concat(data);
                    $scope.total=$scope.abonos.length;
                    $scope.tableParams = new ngTableParams({page:1, count:10, sorting: { id: 'asc'}}, {
                        total: $scope.abonos.length,
                        getData: function($defer, params)
                        {
                            TableService.getTable($defer,params,$scope.filter, $scope.abonos);
                        }
                    });
                    $scope.tableParams.reload();
                    $scope.$watch("filter.$", function () {
                        $scope.tableParams.reload();
                    });
                });
        };
        $scope.verAbonos();
    }]);