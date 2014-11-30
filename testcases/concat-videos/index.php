<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

//$vid1 = file_get_contents("vid1.mpg");

//var_dump($vid1);

//shell_exec("cat vid1.mpg vid2.mpg > test_all.mpg");

//echo "test";

?>
<!DOCTYPE html>
<html>
<head>
	<title>Test: FFMPEG</title>
    <script src="jquery-2.1.1.min.js"></script>
    <script src="filereader.js"></script>

    <style>
        body {
            margin: 0;
            width: 100%;
            height: 100%;
        }
        p {
            white-space: pre-wrap;
        }
        #dropzone {
            width: 100px;
            height: 100px;
            background: red;
            display: block;
            white-space: normal;
        }
    </style>

</head>
<body>
<pre>
<span>Debugging:</span>
</pre>
<div id="dropzone"> Drop a Video here and hit convert</div>
<button id="do">Do It!</button>
<script>

var array = [];

window.onload = function() {

	var button = document.getElementById('do');

	button.addEventListener("click", function() {

		console.log(array);

		var file = _appendBuffer(array[0], array[1]);

		var fileArray = new Uint8Array(file);

		var blob = new Blob([fileArray], {type: "video/mpg"});

		console.log(blob);

		var url = window.URL.createObjectURL(blob);

		console.log(url);

	}, false);

    FileReaderJS.setupDrop(
    	document.getElementById('dropzone'), {
        readAsDefault: 'ArrayBuffer',
        on: {
            loadend: function(e, file) {
				console.log(e.target.result); 
				var arr = new Uint8Array(e.target.result);     
				array.push(arr);         
            }
        }
    });

};

var _appendBuffer = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};
</script>
</body>
</html>