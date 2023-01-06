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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [2.7272727272727274E-4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "sub-user-0"], "isController": false}, {"data": [0.006, 500, 1500, "test-state"], "isController": false}, {"data": [0.0, 500, 1500, "getTestState"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionWiseAnalysis"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user-1"], "isController": false}, {"data": [0.0, 500, 1500, "Send OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "extras"], "isController": false}, {"data": [0.0, 500, 1500, "Result Login Validation"], "isController": false}, {"data": [0.0, 500, 1500, "testLeaderboard"], "isController": false}, {"data": [0.0, 500, 1500, "menu"], "isController": false}, {"data": [0.0, 500, 1500, "Submit OTP Result"], "isController": false}, {"data": [0.0, 500, 1500, "userProfile"], "isController": false}, {"data": [0.0, 500, 1500, "referral_page"], "isController": false}, {"data": [0.0, 500, 1500, "get-priority"], "isController": false}, {"data": [0.0, 500, 1500, "sub-user"], "isController": false}, {"data": [0.0, 500, 1500, "updateModal"], "isController": false}, {"data": [0.0, 500, 1500, "olympiadTestCard"], "isController": false}, {"data": [0.0, 500, 1500, "checkLQLiveUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "moengageAttributes"], "isController": false}, {"data": [0.0, 500, 1500, "dashboardUpsell"], "isController": false}, {"data": [0.0, 500, 1500, "getResults"], "isController": false}, {"data": [0.0, 500, 1500, "getQuestionsSummary"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11000, 0, 0.0, 52912.34009090917, 828, 267518, 28832.5, 146152.4, 160333.75, 191229.91999999998, 11.20788382926521, 83.31565716853703, 3.0074421940655274], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["sub-user-0", 500, 0, 0.0, 99752.83999999998, 26229, 154075, 109933.0, 145258.4, 148790.65, 153011.46, 1.621334163456425, 0.32616683366408555, 0.41166687744010794], "isController": false}, {"data": ["test-state", 500, 0, 0.0, 17489.522000000023, 828, 34050, 16542.0, 31217.7, 32796.35, 33826.96, 11.428049003474126, 3.4596632725361123, 3.0578959247577253], "isController": false}, {"data": ["getTestState", 500, 0, 0.0, 31335.679999999975, 9195, 150001, 18491.0, 129853.9, 149060.5, 149913.75, 2.720274203639727, 0.6588164086939964, 0.6960076575718832], "isController": false}, {"data": ["getQuestionWiseAnalysis", 500, 0, 0.0, 21322.724000000006, 8656, 34441, 21579.5, 31482.9, 33090.3, 34216.51, 6.901597029552638, 165.18675937236875, 1.8264968701257471], "isController": false}, {"data": ["sub-user-1", 500, 0, 0.0, 96311.12800000007, 27280, 166327, 97991.0, 150521.3, 157108.75, 163696.87, 1.502737988615257, 75.88093083723544, 0.3830220849888497], "isController": false}, {"data": ["Send OTP Result", 500, 0, 0.0, 131988.87599999993, 37003, 161018, 140901.0, 158118.4, 159564.9, 160541.77, 1.6480926623618486, 0.4049608310177632, 0.38466225225047057], "isController": false}, {"data": ["extras", 500, 0, 0.0, 18924.762000000013, 3385, 35145, 18760.0, 31589.800000000003, 33310.45, 34691.62, 9.743549770052226, 11.227918680333618, 2.4454026278353727], "isController": false}, {"data": ["Result Login Validation", 500, 0, 0.0, 90250.49399999996, 6802, 161555, 94886.0, 146014.5, 154431.45, 160046.01, 2.632271650434325, 0.7300440905501449, 0.6400738681231903], "isController": false}, {"data": ["testLeaderboard", 500, 0, 0.0, 34589.17999999996, 29711, 39101, 34297.5, 38815.0, 39009.9, 39049.98, 4.717515190398913, 31.050832405555347, 1.2346621787372156], "isController": false}, {"data": ["menu", 500, 0, 0.0, 12907.279999999993, 9095, 28217, 11335.0, 25450.400000000005, 27872.5, 28162.92, 9.448759377893683, 5.00119881134607, 2.3621898444734204], "isController": false}, {"data": ["Submit OTP Result", 500, 0, 0.0, 136124.742, 114366, 161275, 135162.5, 155615.0, 157856.45, 160333.59, 1.1878008105552733, 0.46166476816503776, 0.29927012609693404], "isController": false}, {"data": ["userProfile", 500, 0, 0.0, 88664.32599999991, 21906, 164848, 85846.5, 149875.40000000002, 157833.65, 163316.95, 2.318464249281276, 3.0814744563201337, 0.5864084380506353], "isController": false}, {"data": ["referral_page", 500, 0, 0.0, 14378.116000000004, 9085, 20441, 14779.0, 17525.7, 17723.9, 18330.430000000004, 11.145786892554614, 192.4498613742755, 2.8844077407489968], "isController": false}, {"data": ["get-priority", 500, 0, 0.0, 19259.34600000001, 9297, 29875, 19941.5, 27465.7, 28684.75, 29724.43, 8.080546891413611, 3.622042014803562, 2.1463952680317404], "isController": false}, {"data": ["sub-user", 500, 0, 0.0, 196064.268, 176649, 267518, 188431.5, 256802.2, 265570.6, 266433.3, 1.088461437988175, 55.18095569363294, 0.5537972746014055], "isController": false}, {"data": ["updateModal", 500, 0, 0.0, 20422.776000000005, 10735, 29760, 20537.0, 28176.700000000008, 29005.2, 29662.87, 9.435742592942065, 11.822322018305341, 2.386579425363276], "isController": false}, {"data": ["olympiadTestCard", 500, 0, 0.0, 30871.352000000017, 9585, 51453, 30216.5, 47245.6, 49461.75, 51283.23, 6.309705589137211, 9.889724092348851, 1.632882794063829], "isController": false}, {"data": ["checkLQLiveUpsell", 500, 0, 0.0, 10029.844000000006, 3181, 47013, 5832.0, 40645.60000000002, 46611.65, 46886.95, 8.259002312520648, 2.250255512884044, 2.201862921209118], "isController": false}, {"data": ["moengageAttributes", 500, 0, 0.0, 6330.195999999997, 3175, 10483, 6650.0, 7184.9, 7779.6, 8000.6100000000015, 20.83159736688609, 5.004465773685526, 5.513049693775519], "isController": false}, {"data": ["dashboardUpsell", 500, 0, 0.0, 29384.04399999999, 7519, 51268, 28193.0, 46890.5, 49133.75, 50958.85, 6.477606912902097, 1.6636822442316912, 1.695311184236096], "isController": false}, {"data": ["getResults", 500, 0, 0.0, 34370.473999999995, 10116, 39096, 37182.0, 38836.5, 38884.85, 39058.96, 5.88553805588907, 32.69807226557902, 1.5173652800339008], "isController": false}, {"data": ["getQuestionsSummary", 500, 0, 0.0, 23299.512000000024, 8468, 38872, 23688.0, 34527.00000000001, 37401.0, 38674.99, 6.2028582770940845, 1.8838759025158793, 1.653691708639341], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
