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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.028977272727272727, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.005, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.05, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.005, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.015, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0675, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.4875, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0025, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.005, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4400, 0, 0.0, 21758.774090909115, 35, 92816, 11429.0, 65798.70000000001, 72637.7, 79231.73, 10.831862415653026, 80.52084756553892, 2.90654333729681], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 200, 0, 0.0, 37728.61000000001, 747, 79312, 37081.5, 68902.9, 73631.15, 79204.67, 1.3295573903447542, 0.26746955313576115, 0.33758293114222276], "isController": false}, {"data": ["test-state", 200, 0, 0.0, 7810.720000000003, 35, 15014, 7870.0, 13745.7, 14385.95, 15007.0, 12.383134171258746, 3.7488003838771595, 3.313455823168844], "isController": false}, {"data": ["getTestState", 200, 0, 0.0, 6405.285000000001, 2549, 10527, 6427.0, 9510.1, 10055.949999999999, 10440.98, 7.4052132701421804, 1.7934500888625593, 1.8946932390402844], "isController": false}, {"data": ["getQuestionWiseAnalysis", 200, 0, 0.0, 8442.820000000003, 378, 15452, 8503.0, 14120.7, 14789.85, 15308.300000000001, 11.275864013080003, 269.8829600552518, 2.9841397925241027], "isController": false}, {"data": ["sub-user-1", 200, 0, 0.0, 36159.95000000002, 1748, 71759, 35947.0, 64321.6, 68285.09999999999, 70742.61, 2.416830809759163, 122.03815496114944, 0.6160086341280678], "isController": false}, {"data": ["Send OTP Result", 200, 0, 0.0, 59484.65500000004, 49182, 69567, 59372.0, 67721.6, 68704.55, 69541.78, 1.699451926753622, 0.4189879232697455, 0.3966494243106598], "isController": false}, {"data": ["extras", 200, 0, 0.0, 7646.655000000001, 1277, 16276, 7624.5, 12905.000000000002, 13512.95, 14898.340000000006, 5.14827018121911, 5.93257696663921, 1.2920951529036244], "isController": false}, {"data": ["Result Login Validation", 200, 0, 0.0, 38999.69, 2852, 73597, 39153.5, 67330.3, 70516.65, 73499.23, 2.691282934574912, 0.7464105013860107, 0.6544232917081574], "isController": false}, {"data": ["testLeaderboard", 200, 0, 0.0, 15038.39500000001, 5337, 16612, 14846.5, 16261.8, 16352.95, 16583.510000000002, 4.780114722753346, 31.46286448374761, 1.2510456500956022], "isController": false}, {"data": ["menu", 200, 0, 0.0, 4697.084999999999, 3486, 9781, 4609.0, 5696.0, 5782.6, 5874.9, 9.733307377846991, 5.151809178508858, 2.433326844461748], "isController": false}, {"data": ["Submit OTP Result", 200, 0, 0.0, 68599.22000000003, 49936, 82070, 69244.0, 79336.1, 80597.84999999999, 81678.99, 1.5260302611800791, 0.5931250429196011, 0.38448809314888716], "isController": false}, {"data": ["userProfile", 200, 0, 0.0, 39807.19999999999, 5048, 69561, 40183.0, 64636.5, 67148.5, 69472.91, 2.324662342794709, 3.089712352093358, 0.5879761199060836], "isController": false}, {"data": ["referral_page", 200, 0, 0.0, 4117.065, 3488, 17638, 4007.5, 4406.8, 4480.4, 15338.180000000082, 6.190225633724349, 106.8841595994924, 1.601962688414993], "isController": false}, {"data": ["get-priority", 200, 0, 0.0, 7496.794999999999, 2685, 12477, 7491.5, 11613.300000000001, 12088.449999999999, 12464.84, 9.078117198493032, 4.0691951114338885, 2.4113748808497117], "isController": false}, {"data": ["sub-user", 200, 0, 0.0, 73888.50499999998, 64854, 92816, 72940.0, 80081.7, 83364.7, 91382.24, 1.2340194481465028, 62.56020665198184, 0.6278555981292265], "isController": false}, {"data": ["updateModal", 200, 0, 0.0, 9062.0, 3730, 12344, 9118.5, 11733.4, 12066.3, 12330.44, 8.679802100512108, 10.875181733356479, 2.195379632844371], "isController": false}, {"data": ["olympiadTestCard", 200, 0, 0.0, 13880.639999999996, 2902, 23020, 13742.0, 21518.8, 22400.5, 23007.88, 6.310940014515162, 9.891658909469566, 1.6332022498501153], "isController": false}, {"data": ["checkLQLiveUpsell", 200, 0, 0.0, 2230.675000000002, 1125, 7811, 2242.5, 3048.6000000000004, 3201.2499999999995, 3440.9300000000003, 15.194104687381296, 4.139800007597052, 4.050772050444428], "isController": false}, {"data": ["moengageAttributes", 200, 0, 0.0, 1295.235, 1080, 15521, 1130.0, 1263.9, 1280.0, 9710.490000000056, 7.920478396895173, 1.9027711773791136, 2.0961422319908123], "isController": false}, {"data": ["dashboardUpsell", 200, 0, 0.0, 13039.340000000004, 1151, 22732, 13074.0, 21113.5, 22017.15, 22696.72, 7.130378979642767, 1.8313375699668437, 1.8661538735783807], "isController": false}, {"data": ["getResults", 200, 0, 0.0, 15300.609999999999, 7439, 16613, 15645.0, 16395.4, 16478.65, 16592.9, 4.443555733297784, 24.686902897198337, 1.1456042124908352], "isController": false}, {"data": ["getQuestionsSummary", 200, 0, 0.0, 7561.879999999994, 1445, 13925, 7457.0, 12736.5, 13370.049999999997, 13912.260000000002, 6.393248729341815, 1.9416995652590863, 1.7044501006936674], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4400, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
