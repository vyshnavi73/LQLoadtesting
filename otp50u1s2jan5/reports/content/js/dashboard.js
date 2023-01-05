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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.16363636363636364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.3, 500, 1500, "test-state"], "isController": false}, {"data": [0.09, 500, 1500, "getTestState"], "isController": false}, {"data": [0.16, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.01, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.19, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.48, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.47, 500, 1500, "referral_page"], "isController": false}, {"data": [0.18, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.08, 500, 1500, "updateModal"], "isController": false}, {"data": [0.05, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.49, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.72, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.13, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.02, 500, 1500, "getResults"], "isController": false}, {"data": [0.18, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1100, 0, 0.0, 5638.030909090915, 2, 21812, 2853.0, 17276.8, 19227.5, 20659.690000000002, 10.464032267270408, 77.805263616322, 2.807842465183311], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 50, 0, 0.0, 9782.619999999997, 228, 19264, 9761.0, 17785.3, 18967.0, 19264.0, 1.3177313936327217, 0.26509049520345773, 0.3345802366645583], "isController": false}, {"data": ["test-state", 50, 0, 0.0, 1678.5999999999995, 2, 3232, 1685.0, 3069.4, 3118.9, 3232.0, 12.24589762429586, 3.707254163605192, 3.2767343252510406], "isController": false}, {"data": ["getTestState", 50, 0, 0.0, 2038.5600000000004, 1060, 2673, 2148.5, 2607.7, 2641.5, 2673.0, 6.6720042700827324, 1.615876034160662, 1.7070948425406993], "isController": false}, {"data": ["getQuestionWiseAnalysis", 50, 0, 0.0, 2130.58, 207, 3488, 2108.5, 3289.9, 3431.3999999999996, 3488.0, 10.01001001001001, 239.5852884134134, 2.6491335085085086], "isController": false}, {"data": ["sub-user-1", 50, 0, 0.0, 9763.320000000002, 1396, 19126, 9374.0, 17506.9, 18552.95, 19126.0, 2.2428565020409996, 113.2533019053066, 0.5716655732741219], "isController": false}, {"data": ["Send OTP Result", 50, 0, 0.0, 15441.699999999999, 13306, 17944, 15304.0, 17308.4, 17728.8, 17944.0, 1.6420900522184636, 0.4070587293507176, 0.3832612524220828], "isController": false}, {"data": ["extras", 50, 0, 0.0, 2030.6800000000005, 495, 3540, 2063.5, 3335.9, 3446.2, 3540.0, 4.892846658185733, 5.638241266268715, 1.2279898351110676], "isController": false}, {"data": ["Result Login Validation", 50, 0, 0.0, 10919.680000000002, 2528, 19310, 11326.0, 18130.5, 18854.199999999997, 19310.0, 2.5549310168625445, 0.7085941492079714, 0.6212674054675523], "isController": false}, {"data": ["testLeaderboard", 50, 0, 0.0, 3360.0400000000013, 2433, 3605, 3384.0, 3513.2999999999997, 3561.6499999999996, 3605.0, 4.547108039287013, 29.92920721171335, 1.190063432157148], "isController": false}, {"data": ["menu", 50, 0, 0.0, 1232.26, 1009, 2854, 1178.0, 1292.6, 1952.849999999994, 2854.0, 8.613264427217917, 4.558973944875108, 2.153316106804479], "isController": false}, {"data": ["Submit OTP Result", 50, 0, 0.0, 18047.90000000001, 13840, 21433, 18111.0, 20761.8, 21093.149999999998, 21433.0, 1.4423354295274908, 0.5605952157733803, 0.36340091876766867], "isController": false}, {"data": ["userProfile", 50, 0, 0.0, 9777.14, 1541, 17405, 10173.0, 16251.9, 16946.35, 17405.0, 2.2225185580299596, 2.953952888162866, 0.5621409243454683], "isController": false}, {"data": ["referral_page", 50, 0, 0.0, 1233.1000000000004, 1036, 3850, 1105.0, 1164.2, 2812.1999999999925, 3850.0, 6.050338818973862, 104.46878970534851, 1.5657615107696032], "isController": false}, {"data": ["get-priority", 50, 0, 0.0, 2029.6000000000001, 1182, 3237, 1947.5, 3065.6, 3134.2, 3237.0, 8.081461128171973, 3.622451814288023, 2.1466381121706806], "isController": false}, {"data": ["sub-user", 50, 0, 0.0, 19546.52, 18637, 21812, 19342.0, 20649.7, 21158.8, 21812.0, 1.2030798845043311, 60.99168559011068, 0.6121138865495669], "isController": false}, {"data": ["updateModal", 50, 0, 0.0, 2148.88, 1074, 3055, 2127.0, 2953.3, 3015.6, 3055.0, 8.39630562552477, 10.51998058354324, 2.123674958018472], "isController": false}, {"data": ["olympiadTestCard", 50, 0, 0.0, 3401.7999999999993, 919, 5597, 3409.5, 5295.3, 5448.9, 5597.0, 6.165988407941793, 9.664464252682205, 1.5956903594771241], "isController": false}, {"data": ["checkLQLiveUpsell", 50, 0, 0.0, 746.22, 484, 3051, 583.0, 968.8, 1854.449999999992, 3051.0, 10.096930533117932, 2.7510191589256867, 2.6918574565831985], "isController": false}, {"data": ["moengageAttributes", 50, 0, 0.0, 602.58, 278, 3327, 496.0, 705.8, 2317.6999999999925, 3327.0, 6.901311249137336, 1.6579321946169772, 1.826421238785369], "isController": false}, {"data": ["dashboardUpsell", 50, 0, 0.0, 2926.1800000000007, 310, 5117, 3000.0, 4882.4, 5113.45, 5117.0, 7.123521869212139, 1.829576417580852, 1.8643592392078643], "isController": false}, {"data": ["getResults", 50, 0, 0.0, 3252.38, 899, 3536, 3340.0, 3473.4, 3505.25, 3536.0, 4.708984742889434, 26.340883405537767, 1.214035129026182], "isController": false}, {"data": ["getQuestionsSummary", 50, 0, 0.0, 1946.3400000000004, 450, 3247, 1965.0, 3085.3, 3227.5, 3247.0, 6.222775357809583, 1.8899249377722465, 1.6590016334785314], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1100, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
