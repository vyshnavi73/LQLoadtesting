/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03391304347826087, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2025, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.0, 500, 1500, "Search for Test Users"], "isController": false}, {"data": [0.0125, 500, 1500, "General Submit OTP"], "isController": false}, {"data": [0.3175, 500, 1500, "Test Users Login"], "isController": false}, {"data": [0.0625, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "General Send OTP"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0075, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0025, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.005, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0175, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.1525, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4600, 0, 0.0, 13031.15804347828, 3, 81611, 8668.5, 34296.30000000008, 45700.74999999999, 58973.30999999998, 17.53269275480529, 129.73314217298667, 4.748685762691192], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 200, 0, 0.0, 6500.475, 366, 54178, 1686.5, 22367.8, 40399.94999999998, 50997.62000000002, 3.568242640499554, 0.7178300624442463, 0.9059991079393399], "isController": false}, {"data": ["Search for Test Users", 200, 0, 0.0, 7452.160000000001, 5231, 9467, 7435.0, 8784.4, 8989.199999999999, 9392.69, 20.959966464053657, 140.7428998113603, 6.017802871515405], "isController": false}, {"data": ["General Submit OTP", 200, 0, 0.0, 24128.25, 906, 47939, 24293.0, 43396.1, 45697.65, 47874.4, 4.027142943438777, 1.0775753579123293, 1.0107184926403963], "isController": false}, {"data": ["Test Users Login", 200, 0, 0.0, 1446.2749999999994, 928, 2458, 1426.5, 1850.6, 1918.7999999999997, 2146.8900000000003, 59.488399762046406, 19.75200773349197, 14.52353509815586], "isController": false}, {"data": ["test-state", 200, 0, 0.0, 6571.969999999997, 3, 12651, 6659.5, 11329.7, 12062.8, 12643.020000000002, 10.112757243262376, 3.061479243565758, 2.7059526217323153], "isController": false}, {"data": ["getTestState", 200, 0, 0.0, 11677.24, 3544, 57716, 9552.5, 20030.7, 20393.95, 57587.070000000014, 2.151139028115387, 0.5209789833716952, 0.5503890872717103], "isController": false}, {"data": ["General Send OTP", 200, 0, 0.0, 26680.605000000003, 4039, 49170, 26590.0, 45248.3, 47307.299999999996, 49112.93, 3.81286460517787, 0.9345986483394975, 1.0388566648873299], "isController": false}, {"data": ["getQuestionWiseAnalysis", 200, 0, 0.0, 8400.734999999999, 3125, 13542, 8444.5, 12161.2, 12736.249999999998, 13389.420000000004, 6.00294144130624, 143.6778240087643, 1.5886690728456945], "isController": false}, {"data": ["sub-user-1", 200, 0, 0.0, 32979.74, 1415, 58534, 34608.5, 54646.700000000004, 56962.2, 58458.8, 2.452573362600709, 123.84297935546373, 0.625118796522251], "isController": false}, {"data": ["extras", 200, 0, 0.0, 7765.834999999995, 1481, 14134, 7761.5, 13057.900000000001, 13515.05, 13945.87, 6.5400085020110525, 7.536337922239299, 1.6413888525555083], "isController": false}, {"data": ["testLeaderboard", 200, 0, 0.0, 13019.605, 3914, 14226, 13850.5, 14172.9, 14189.0, 14215.86, 4.463090243684727, 29.37619945550299, 1.1680743997143623], "isController": false}, {"data": ["menu", 200, 0, 0.0, 5087.450000000003, 3796, 10795, 4780.5, 6414.7, 6552.2, 10734.230000000001, 7.717240314863405, 4.084711182281216, 1.9293100787158513], "isController": false}, {"data": ["userProfile", 200, 0, 0.0, 34140.005, 1205, 57008, 35674.5, 52398.5, 55220.649999999994, 56903.35, 2.3988005997001496, 3.188249625187406, 0.6067278860569715], "isController": false}, {"data": ["referral_page", 200, 0, 0.0, 5698.694999999999, 3790, 19960, 4317.5, 10204.200000000003, 14999.95, 19240.310000000016, 5.701091759071862, 98.43847987514609, 1.4753801915566829], "isController": false}, {"data": ["get-priority", 200, 0, 0.0, 7722.634999999998, 3689, 20944, 7762.5, 10251.0, 10740.65, 20914.460000000003, 4.768262445164982, 2.13733638899485, 1.2665697119969481], "isController": false}, {"data": ["sub-user", 200, 0, 0.0, 39480.350000000006, 2696, 81611, 39318.0, 69857.3, 76225.24999999999, 80443.27, 2.395697327599631, 121.45296422624965, 1.2189045973431716], "isController": false}, {"data": ["updateModal", 200, 0, 0.0, 8092.445000000001, 3585, 10794, 8436.0, 10260.9, 10604.25, 10786.82, 8.04214081788572, 10.07623698178455, 2.03409616389883], "isController": false}, {"data": ["olympiadTestCard", 200, 0, 0.0, 12510.460000000001, 4101, 20329, 12651.0, 18538.6, 19612.6, 20097.48, 5.5922156358349175, 8.765142671401408, 1.4472042416955597], "isController": false}, {"data": ["checkLQLiveUpsell", 200, 0, 0.0, 3942.0800000000004, 1359, 19687, 3454.0, 6568.5, 6899.299999999999, 19643.500000000007, 6.374908360692315, 1.7369135084308163, 1.6995605297548848], "isController": false}, {"data": ["moengageAttributes", 200, 0, 0.0, 2585.2400000000002, 1197, 12009, 1615.5, 6166.0, 8953.4, 11847.360000000002, 8.44059928254906, 2.027722093268622, 2.23379141169023], "isController": false}, {"data": ["dashboardUpsell", 200, 0, 0.0, 11860.019999999993, 1645, 19952, 12325.0, 18428.4, 19226.2, 19757.96, 5.99322765275239, 1.5392762428455844, 1.5685400497437894], "isController": false}, {"data": ["getResults", 200, 0, 0.0, 13021.109999999995, 2271, 14188, 13271.0, 13975.3, 14106.75, 14179.83, 4.793174519484254, 26.62926742318938, 1.2357403058045344], "isController": false}, {"data": ["getQuestionsSummary", 200, 0, 0.0, 8953.255000000001, 3750, 13999, 8775.0, 13147.9, 13548.449999999999, 13883.580000000002, 4.56266824839166, 1.3857322512205137, 1.2164144841903544], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
