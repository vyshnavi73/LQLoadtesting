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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1915, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.25, 500, 1500, "test-state"], "isController": false}, {"data": [0.14, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "sub-login"], "isController": false}, {"data": [0.15, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.05, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.19, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.48, 500, 1500, "menu"], "isController": false}, {"data": [0.01, 500, 1500, "userProfile"], "isController": false}, {"data": [0.44, 500, 1500, "referral_page"], "isController": false}, {"data": [0.21, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.16, 500, 1500, "updateModal"], "isController": false}, {"data": [0.02, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.49, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.68, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.32, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.01, 500, 1500, "getResults"], "isController": false}, {"data": [0.14, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 0, 0.0, 3326.7580000000034, 3, 18992, 2025.0, 8109.899999999993, 12796.649999999996, 16676.870000000003, 18.184463194646494, 90.21727734261347, 4.951519226660242], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 50, 0, 0.0, 7785.98, 201, 15403, 7379.5, 14402.8, 15396.25, 15403.0, 2.235136343316942, 0.449646569065713, 0.5675150871703174], "isController": false}, {"data": ["test-state", 50, 0, 0.0, 2055.480000000001, 3, 4089, 2166.5, 3795.3999999999996, 3998.6999999999994, 4089.0, 10.690613641223006, 3.2364162390421214, 2.860574353217875], "isController": false}, {"data": ["getTestState", 50, 0, 0.0, 1907.6000000000001, 812, 2905, 1849.0, 2838.4, 2878.0, 2905.0, 6.947339169098235, 1.682558705015979, 1.7843263686258164], "isController": false}, {"data": ["sub-login", 50, 0, 0.0, 10437.9, 2191, 18992, 10582.5, 17673.6, 18141.6, 18992.0, 2.625774603508035, 0.8744034568322654, 0.6733163040909568], "isController": false}, {"data": ["getQuestionWiseAnalysis", 50, 0, 0.0, 2448.6999999999994, 219, 4336, 2432.5, 4069.1, 4275.799999999999, 4336.0, 9.18105031215571, 264.7700146896805, 2.4387164891663606], "isController": false}, {"data": ["sub-user-1", 50, 0, 0.0, 4347.96, 841, 7010, 4760.0, 6482.7, 6750.45, 7010.0, 4.672897196261682, 69.42446699766356, 1.1910411799065421], "isController": false}, {"data": ["extras", 50, 0, 0.0, 1981.0199999999998, 496, 4180, 1994.0, 3250.6, 3452.15, 4180.0, 4.639510067736847, 5.296925019717918, 1.1689390600352603], "isController": false}, {"data": ["testLeaderboard", 50, 0, 0.0, 3705.36, 2726, 4413, 3687.0, 4276.3, 4361.0, 4413.0, 4.001600640256102, 36.061299519807925, 1.051201730692277], "isController": false}, {"data": ["menu", 50, 0, 0.0, 1009.38, 802, 1801, 994.0, 1116.0, 1352.899999999998, 1801.0, 9.875567845151096, 5.018601557870828, 2.4785360705115544], "isController": false}, {"data": ["userProfile", 50, 0, 0.0, 4017.8000000000006, 1031, 6214, 3720.5, 5855.4, 5909.2, 6214.0, 4.216207100092757, 5.652682034741546, 1.0705213340079265], "isController": false}, {"data": ["referral_page", 50, 0, 0.0, 1213.8400000000006, 832, 1799, 1177.5, 1503.8, 1533.6, 1799.0, 10.185373803218578, 176.18210016041965, 2.645809991851701], "isController": false}, {"data": ["get-priority", 50, 0, 0.0, 1692.9199999999996, 945, 2594, 1662.5, 2444.6, 2576.65, 2594.0, 9.295408068414202, 4.023713457427031, 2.4781703151143337], "isController": false}, {"data": ["sub-user", 50, 0, 0.0, 12134.119999999999, 6934, 18969, 12284.5, 15818.6, 17335.999999999993, 18969.0, 1.915929033988581, 28.85007436199563, 0.9748037370195808], "isController": false}, {"data": ["updateModal", 50, 0, 0.0, 1791.26, 935, 2518, 1763.5, 2417.7, 2494.8, 2518.0, 8.689607229753214, 10.871004138425445, 2.2063455856795273], "isController": false}, {"data": ["olympiadTestCard", 50, 0, 0.0, 1737.62, 769, 2085, 1750.0, 1998.6, 2051.75, 2085.0, 10.216591744993869, 16.230811963628934, 2.6539193400081733], "isController": false}, {"data": ["checkLQLiveUpsell", 50, 0, 0.0, 792.4399999999998, 645, 3109, 732.5, 798.8, 1109.1499999999971, 3109.0, 10.319917440660475, 2.8018978973168216, 2.7613841589267287], "isController": false}, {"data": ["moengageAttributes", 50, 0, 0.0, 636.82, 314, 3338, 538.5, 741.5, 1838.9499999999896, 3338.0, 6.810133478616181, 1.6360281599019342, 1.808941705257423], "isController": false}, {"data": ["dashboardUpsell", 50, 0, 0.0, 1295.4399999999996, 352, 1983, 1322.0, 1903.4, 1963.9, 1983.0, 13.444474321054047, 3.4530241664425922, 3.531800383167518], "isController": false}, {"data": ["getResults", 50, 0, 0.0, 3278.04, 954, 3450, 3350.5, 3429.8, 3435.15, 3450.0, 4.453152832205202, 25.592930341556823, 1.1524272466156038], "isController": false}, {"data": ["getQuestionsSummary", 50, 0, 0.0, 2265.48, 158, 4108, 2207.5, 3819.1, 3995.0499999999997, 4108.0, 5.355612682090831, 1.6265581485646958, 1.4330447997000857], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
