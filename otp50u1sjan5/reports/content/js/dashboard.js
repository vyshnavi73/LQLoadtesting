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

    var data = {"OkPercent": 26.818181818181817, "KoPercent": 73.18181818181819};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0022727272727272726, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.0, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1100, 805, 73.18181818181819, 4505.084545454544, 0, 23882, 45.0, 17830.9, 20754.550000000003, 22840.37, 14.101298601407565, 97.96395225348365, 3.1435480149217376], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 50, 0, 0.0, 10003.96, 385, 21953, 9691.0, 19082.399999999998, 20507.69999999999, 21953.0, 1.1775788977861517, 0.23689575482807348, 0.29899464201601506], "isController": false}, {"data": ["test-state", 50, 50, 100.0, 62.55999999999999, 4, 256, 59.0, 103.0, 114.69999999999997, 256.0, 135.86956521739128, 518.9315132472826, 36.35572350543478], "isController": false}, {"data": ["getTestState", 50, 50, 100.0, 90.28, 1, 1286, 12.5, 63.699999999999996, 1188.5, 1286.0, 36.023054755043226, 100.39456502161384, 0.5530101765129684], "isController": false}, {"data": ["getQuestionWiseAnalysis", 50, 50, 100.0, 41.95999999999999, 1, 103, 34.0, 85.5, 93.44999999999999, 103.0, 138.12154696132598, 527.5325880524862, 36.55365158839779], "isController": false}, {"data": ["sub-user-1", 50, 3, 6.0, 11566.24, 236, 22891, 11045.5, 21438.1, 22657.85, 22891.0, 2.148504640770024, 102.30167791498369, 0.51475989117824], "isController": false}, {"data": ["Send OTP Result", 50, 0, 0.0, 14688.860000000004, 11994, 17840, 14466.0, 17100.4, 17621.3, 17840.0, 1.725446890744703, 0.4269470050555594, 0.4027166082890468], "isController": false}, {"data": ["extras", 50, 50, 100.0, 23.980000000000004, 1, 104, 22.0, 45.0, 52.849999999999945, 104.0, 124.06947890818859, 473.8630195409429, 31.138531327543422], "isController": false}, {"data": ["Result Login Validation", 50, 0, 0.0, 11266.539999999999, 2387, 19881, 11701.0, 18614.0, 19379.899999999998, 19881.0, 2.5087807325639737, 0.6957946562970396, 0.610045314851982], "isController": false}, {"data": ["testLeaderboard", 50, 50, 100.0, 36.20000000000001, 1, 147, 29.5, 79.69999999999999, 90.79999999999998, 147.0, 127.87723785166241, 488.4061301150895, 33.46787084398977], "isController": false}, {"data": ["menu", 50, 50, 100.0, 458.50000000000017, 1, 1198, 28.5, 1188.9, 1193.9, 1198.0, 34.91620111731844, 122.01234615048884, 6.110335195530727], "isController": false}, {"data": ["Submit OTP Result", 50, 0, 0.0, 17685.2, 12800, 22032, 17855.5, 20793.4, 21287.6, 22032.0, 1.4757098164216989, 0.5735669013045275, 0.37180969984062334], "isController": false}, {"data": ["userProfile", 50, 49, 98.0, 10716.059999999998, 7, 21239, 11130.0, 20057.6, 20966.75, 21239.0, 2.3388530264758165, 4.789578144003181, 0.011831307301899149], "isController": false}, {"data": ["referral_page", 50, 50, 100.0, 296.4800000000001, 1, 1202, 17.0, 1188.9, 1194.45, 1202.0, 35.536602700781806, 133.41703869047618, 8.644695051528073], "isController": false}, {"data": ["get-priority", 50, 50, 100.0, 228.48, 0, 1201, 18.5, 1187.8, 1193.35, 1201.0, 37.53753753753754, 112.47184684684684, 2.393018018018018], "isController": false}, {"data": ["sub-user", 50, 3, 6.0, 21571.160000000003, 20287, 23882, 21200.0, 23275.0, 23547.6, 23882.0, 1.170987610951076, 55.99248793150894, 0.5778778118340008], "isController": false}, {"data": ["updateModal", 50, 50, 100.0, 118.95999999999998, 1, 1199, 16.0, 156.69999999999987, 1191.45, 1199.0, 34.41156228492773, 106.08708275980729, 2.7851858224363384], "isController": false}, {"data": ["olympiadTestCard", 50, 50, 100.0, 48.699999999999996, 1, 1168, 20.0, 65.19999999999999, 129.4999999999996, 1168.0, 34.698126301179734, 131.02066707147813, 8.62031575294934], "isController": false}, {"data": ["checkLQLiveUpsell", 50, 50, 100.0, 59.100000000000016, 1, 1018, 39.0, 71.99999999999999, 145.5499999999995, 1018.0, 38.16793893129771, 145.77618082061068, 10.175632156488549], "isController": false}, {"data": ["moengageAttributes", 50, 50, 100.0, 35.320000000000014, 1, 111, 31.0, 76.6, 84.59999999999997, 111.0, 161.81229773462783, 618.015523867314, 42.82337176375405], "isController": false}, {"data": ["dashboardUpsell", 50, 50, 100.0, 46.72000000000002, 1, 1022, 18.0, 52.49999999999999, 119.0999999999995, 1022.0, 34.45899379738112, 130.86408619055823, 8.838193487250171], "isController": false}, {"data": ["getResults", 50, 50, 100.0, 30.999999999999993, 1, 73, 30.0, 61.9, 65.44999999999999, 73.0, 117.096018735363, 447.2290324941452, 30.188817330210775], "isController": false}, {"data": ["getQuestionsSummary", 50, 50, 100.0, 35.59999999999999, 1, 107, 31.5, 76.19999999999999, 87.35, 107.0, 138.88888888888889, 530.4633246527778, 37.02799479166667], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 610, 75.77639751552795, 55.45454545454545], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: testapi.logiqids.com:443 failed to respond", 53, 6.583850931677019, 4.818181818181818], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 142, 17.63975155279503, 12.909090909090908], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1100, 805, "502/Bad Gateway", 610, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 142, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: testapi.logiqids.com:443 failed to respond", 53, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["test-state", 50, 50, "502/Bad Gateway", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getTestState", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 46, "502/Bad Gateway", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: testapi.logiqids.com:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["getQuestionWiseAnalysis", 50, 50, "502/Bad Gateway", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["sub-user-1", 50, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: testapi.logiqids.com:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["extras", 50, 50, "502/Bad Gateway", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["testLeaderboard", 50, 50, "502/Bad Gateway", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["menu", 50, 50, "502/Bad Gateway", 35, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 15, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["userProfile", 50, 49, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: testapi.logiqids.com:443 failed to respond", 46, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["referral_page", 50, 50, "502/Bad Gateway", 47, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["get-priority", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 38, "502/Bad Gateway", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["sub-user", 50, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: testapi.logiqids.com:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["updateModal", 50, 50, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 34, "502/Bad Gateway", 16, "", "", "", "", "", ""], "isController": false}, {"data": ["olympiadTestCard", 50, 50, "502/Bad Gateway", 48, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["checkLQLiveUpsell", 50, 50, "502/Bad Gateway", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["moengageAttributes", 50, 50, "502/Bad Gateway", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["dashboardUpsell", 50, 50, "502/Bad Gateway", 49, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to testapi.logiqids.com:443 [testapi.logiqids.com/65.0.6.230] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["getResults", 50, 50, "502/Bad Gateway", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getQuestionsSummary", 50, 50, "502/Bad Gateway", 50, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
