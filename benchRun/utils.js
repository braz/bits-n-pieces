// unfinished, do not use
// function debugPrint(o) {
// if (o is obj)   {
// print(o); // or
// printjson(o); // todo 
// }
// }

// given result object returned by benchRun print a semi-pretty
// format of its output (that matters)
// opertations could be an array
function writeObj (obj, op) {
   printjson(obj); 
   printjson(op); 
   for (var field in obj) {
      if (field != "trapped" && field != "note") {
        if (obj[field] != 0) {
           if (field.indexOf("Latency") > -1) {
               print ("Latency " + field.slice(0,field.indexOf("Latency")) + " (avg ms): \t\t " + Math.floor(obj[field]));
           } else {
               print ("Number of " + field +  " (per sec): \t " + obj[field]);
           }
        } else {
          // the only 0 field we care about is errCount!
          if (field == "errCount") {
                   print ("    No errors running " + op)
          }
        }
      }
   }
}


// run multiple steps in passed in ops array
// useful if you want to look at individual results rather than combined
function doMany (ops, secs, threads, atOnce) {
   // to see results for all, change to false; to see results for some
   // operations only, add showResult : true on the op level
   var hide = true;
   var hostPort = getHostName() + ':' + myPort();

   // default 1/10th of a second
   if (!secs) secs = .1;
   // default to single threaded
   if (!threads) threads = 1;
   print ("Running " + ops.length + " operations");
   // printjson (ops);
   // passing in description as extra element
   // benchRun ignores fields it doesn't expect
   if (atOnce) {
        res = benchRun( { ops : ops,
                      host : hostPort,
                      parallel : threads , 
                      seconds : secs
                      ,hideResults : hide
                      } );
        var opers=[];
        ops.forEach( function(o) { opers.push(o.op); } );
        writeObj( res, opers.join() );
   } else {
     for (i=0; i < ops.length; i++) {
        print ("----");
        operation = ops[i];
        // printjson(operation);
        if ("description" in operation) {
             print(operation.description);
        } else { print("Generic " + operation.op); }
        print ("Running operation:" + operation.op + " (" + secs + " secs, " + threads + " threads)");

        res = benchRun( { ops : [ operation ],
                      host : hostPort,
                      parallel : threads , 
                      seconds : secs
                      ,hideResults : hide
                      } );
        writeObj( res, operation.op );
     }
   }

}

/* run steps in op array all together */
function doAll(op, secs, threads) {
   doMany(op, secs, threads, true)
}
/* run steps in op array one at a time */
function doOne(op, secs, threads) {
   doMany([op], secs, threads, false)
}

