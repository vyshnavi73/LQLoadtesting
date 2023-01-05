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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.010125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0025, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.035, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "sub-login"], "isController": false}, {"data": [0.0025, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.005, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0075, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.15, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4000, 0, 0.0, 14053.976500000033, 3, 79855, 8367.0, 32930.10000000002, 54416.74999999998, 68797.62999999999, 17.21859436004942, 94.00928781741403, 4.688401285798534], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 200, 0, 0.0, 34450.095, 1026, 67542, 34287.5, 61432.1, 64608.6, 67536.92, 2.0113439800474677, 0.40462583973611166, 0.5106928074339273], "isController": false}, {"data": ["test-state", 200, 0, 0.0, 9463.765000000009, 3, 17799, 9636.0, 16496.600000000002, 17267.5, 17772.94, 10.329511414110112, 3.1270981820059913, 2.7639512963536825], "isController": false}, {"data": ["getTestState", 200, 0, 0.0, 5732.84, 2496, 12482, 5817.5, 8386.9, 8755.55, 9158.920000000002, 7.919223916056227, 1.9179370421698674, 2.033941298752722], "isController": false}, {"data": ["sub-login", 200, 0, 0.0, 45198.59999999996, 10587, 79855, 45353.5, 73246.0, 76359.79999999999, 79595.92, 2.4731049833065417, 0.8235632805737603, 0.6338297576357116], "isController": false}, {"data": ["getQuestionWiseAnalysis", 200, 0, 0.0, 10123.585000000006, 913, 18147, 10050.5, 16986.9, 17683.85, 18083.6, 9.165062780680048, 273.43065305368435, 2.4344698011181376], "isController": false}, {"data": ["sub-user-1", 200, 0, 0.0, 15432.994999999994, 1121, 31327, 14340.0, 29034.1, 29937.949999999997, 31110.74, 4.83851457602516, 93.13249875257046, 1.233254203459538], "isController": false}, {"data": ["extras", 200, 0, 0.0, 7486.970000000002, 1417, 15152, 7428.0, 12558.7, 13147.449999999999, 13610.97, 6.376127777600663, 7.281519241958109, 1.606485318965792], "isController": false}, {"data": ["testLeaderboard", 200, 0, 0.0, 17119.050000000007, 3472, 19566, 17295.0, 19168.8, 19333.65, 19498.59, 5.2764879696074285, 47.55022556986069, 1.386108656078514], "isController": false}, {"data": ["menu", 200, 0, 0.0, 4259.749999999998, 3421, 5173, 4280.0, 4831.6, 4888.85, 5131.6900000000005, 14.418571119602047, 7.3272812882993295, 3.618723415759498], "isController": false}, {"data": ["userProfile", 200, 0, 0.0, 20590.040000000005, 3191, 30702, 21400.5, 29252.8, 29917.75, 30629.190000000002, 4.607764082478977, 6.177643704642322, 1.1699400990669278], "isController": false}, {"data": ["referral_page", 200, 0, 0.0, 4010.899999999999, 3437, 8110, 3974.0, 4448.9, 4515.3, 4871.410000000001, 11.869436201780417, 205.32038204747772, 3.0832715133531154], "isController": false}, {"data": ["get-priority", 200, 0, 0.0, 7817.710000000001, 2599, 13204, 7417.0, 12433.6, 12781.9, 13061.82, 9.472836640932126, 4.098713248354095, 2.5254730497797566], "isController": false}, {"data": ["sub-user", 200, 0, 0.0, 49883.18000000003, 27973, 70781, 52967.5, 65370.7, 68119.99999999999, 70285.77, 1.8369858735786322, 35.72814639801514, 0.9346383204438158], "isController": false}, {"data": ["updateModal", 200, 0, 0.0, 9016.425000000001, 3463, 12950, 9432.5, 12182.6, 12477.95, 12949.67, 9.119095385737735, 11.408353447588, 2.315395312784972], "isController": false}, {"data": ["olympiadTestCard", 200, 0, 0.0, 6481.840000000002, 2734, 8523, 6474.5, 8200.8, 8365.55, 8489.65, 12.440131865397772, 19.759339331809414, 3.2315186290974682], "isController": false}, {"data": ["checkLQLiveUpsell", 200, 0, 0.0, 2473.2950000000023, 2125, 2825, 2500.0, 2616.4, 2692.2999999999997, 2804.99, 25.546046749265553, 6.935851481670712, 6.835563290330821], "isController": false}, {"data": ["moengageAttributes", 200, 0, 0.0, 1776.0100000000007, 1233, 13432, 1687.5, 2163.9, 2220.75, 2445.1600000000017, 10.847751803438737, 2.606002874654228, 2.8814340727884145], "isController": false}, {"data": ["dashboardUpsell", 200, 0, 0.0, 5571.325000000001, 2137, 8401, 5600.5, 7878.3, 8158.15, 8366.93, 14.62736780516346, 3.7568337233964746, 3.8425409566298545], "isController": false}, {"data": ["getResults", 200, 0, 0.0, 13800.039999999999, 12967, 17468, 13813.0, 14073.7, 14337.65, 15222.29, 4.2195873243596775, 25.061237585182916, 1.0919830478079242], "isController": false}, {"data": ["getQuestionsSummary", 200, 0, 0.0, 10391.115000000002, 1998, 19047, 10348.0, 17391.5, 18347.25, 19043.670000000002, 5.005380784343169, 1.520188890557349, 1.3393304051855746], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
