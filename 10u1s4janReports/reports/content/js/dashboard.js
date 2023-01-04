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

    var data = {"OkPercent": 95.23809523809524, "KoPercent": 4.761904761904762};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.638095238095238, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45, 500, 1500, "sub-user-0"], "isController": false}, {"data": [1.0, 500, 1500, "test-state"], "isController": false}, {"data": [0.95, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "sub-login"], "isController": false}, {"data": [0.85, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.1, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.65, 500, 1500, "extras"], "isController": false}, {"data": [0.8, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.95, 500, 1500, "menu"], "isController": false}, {"data": [0.35, 500, 1500, "userProfile"], "isController": false}, {"data": [1.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.7, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "get-online-dashboard"], "isController": false}, {"data": [0.7, 500, 1500, "updateModal"], "isController": false}, {"data": [0.55, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [1.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.85, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.85, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.65, 500, 1500, "getResults"], "isController": false}, {"data": [1.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 210, 10, 4.761904761904762, 844.7380952380947, 4, 4529, 479.0, 2399.8, 3472.8, 4350.13, 14.309076042518397, 110.49276348289725, 3.892675541700736], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 10, 0, 0.0, 1192.6999999999998, 15, 2754, 1039.5, 2679.1000000000004, 2754.0, 2754.0, 1.8254837531945967, 0.36723598941219426, 0.46350173420956553], "isController": false}, {"data": ["test-state", 10, 0, 0.0, 159.8, 4, 293, 179.0, 292.7, 293.0, 293.0, 11.086474501108649, 3.356256929046563, 2.966498059866962], "isController": false}, {"data": ["getTestState", 10, 0, 0.0, 331.5, 151, 515, 326.0, 512.3, 515.0, 515.0, 4.743833017077798, 1.1488970588235294, 1.2137541508538898], "isController": false}, {"data": ["sub-login", 10, 0, 0.0, 2659.7, 1591, 3827, 2513.0, 3817.2, 3827.0, 3827.0, 2.2346368715083798, 0.7441515363128492, 0.5848463687150839], "isController": false}, {"data": ["getQuestionWiseAnalysis", 10, 0, 0.0, 422.2, 159, 569, 462.0, 567.7, 569.0, 569.0, 7.552870090634442, 180.77470024546827, 1.998855268126888], "isController": false}, {"data": ["sub-user-1", 10, 0, 0.0, 2488.5, 1197, 4335, 2304.0, 4247.5, 4335.0, 4335.0, 1.9047619047619047, 96.1811755952381, 0.48549107142857145], "isController": false}, {"data": ["extras", 10, 0, 0.0, 585.2, 267, 846, 604.0, 845.6, 846.0, 846.0, 4.053506282934738, 4.671032630725578, 1.017335072963113], "isController": false}, {"data": ["testLeaderboard", 10, 0, 0.0, 485.09999999999997, 202, 658, 486.0, 657.1, 658.0, 658.0, 4.478280340349306, 29.476181146439767, 1.172049932825795], "isController": false}, {"data": ["menu", 10, 0, 0.0, 242.89999999999998, 173, 564, 208.5, 531.9000000000001, 564.0, 564.0, 5.353319057815845, 2.8334950481798713, 1.3383297644539613], "isController": false}, {"data": ["userProfile", 10, 0, 0.0, 1320.8999999999999, 317, 2412, 1236.0, 2411.2, 2412.0, 2412.0, 2.288329519450801, 3.0414223398169336, 0.5787864702517163], "isController": false}, {"data": ["referral_page", 10, 0, 0.0, 210.7, 140, 281, 215.0, 277.6, 281.0, 281.0, 5.592841163310962, 96.56935996923937, 1.4473661213646531], "isController": false}, {"data": ["get-priority", 10, 0, 0.0, 650.6, 312, 952, 669.5, 951.5, 952.0, 952.0, 4.923682914820286, 2.207002400295421, 1.3078532742491382], "isController": false}, {"data": ["sub-user", 10, 0, 0.0, 3681.9, 2243, 4529, 3646.5, 4511.3, 4529.0, 4529.0, 1.3787398317937405, 69.8969930545981, 0.7014877464497449], "isController": false}, {"data": ["get-online-dashboard", 10, 10, 100.0, 360.4, 199, 580, 299.0, 576.3, 580.0, 580.0, 4.008016032064128, 0.9902617735470941, 1.107684118236473], "isController": false}, {"data": ["updateModal", 10, 0, 0.0, 549.9000000000001, 257, 859, 562.0, 852.6, 859.0, 859.0, 4.046944556859571, 5.0705369789558885, 1.0235924220963173], "isController": false}, {"data": ["olympiadTestCard", 10, 0, 0.0, 772.6, 424, 1087, 753.5, 1086.6, 1087.0, 1087.0, 4.4543429844097995, 6.981660634743875, 1.1527352449888641], "isController": false}, {"data": ["checkLQLiveUpsell", 10, 0, 0.0, 137.7, 70, 295, 110.5, 290.40000000000003, 295.0, 295.0, 6.793478260869565, 1.8509574558423914, 1.8111519191576086], "isController": false}, {"data": ["moengageAttributes", 10, 0, 0.0, 248.7, 61, 627, 119.5, 624.2, 627.0, 627.0, 5.109862033725089, 1.2275645120081757, 1.352317003065917], "isController": false}, {"data": ["dashboardUpsell", 10, 0, 0.0, 431.1, 148, 750, 436.0, 749.7, 750.0, 750.0, 5.065856129685917, 1.301093908308004, 1.325829533941236], "isController": false}, {"data": ["getResults", 10, 0, 0.0, 539.6999999999999, 321, 752, 571.0, 740.4000000000001, 752.0, 752.0, 4.191114836546522, 18.884574077954735, 1.08052179379715], "isController": false}, {"data": ["getQuestionsSummary", 10, 0, 0.0, 267.7, 11, 439, 292.5, 437.8, 439.0, 439.0, 6.238303181534623, 1.894640907673113, 1.6631413755458515], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 10, 100.0, 4.761904761904762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 210, 10, "403/Forbidden", 10, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["get-online-dashboard", 10, 10, "403/Forbidden", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
