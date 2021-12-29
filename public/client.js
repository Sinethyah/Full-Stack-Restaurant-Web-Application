
//privacy change
function savePrivacy(){

	console.log("Here");

	let selectedValue;
	if (document.getElementById("onbtn").checked==true){
		console.log("1");
		selectedValue = document.getElementById('onbtn').value;  
		console.log(selectedValue);

	}
	else if (document.getElementById("offbtn").checked==true){
		console.log("2");
		selectedValue = document.getElementById('offbtn').value;  
		console.log(selectedValue);

	}

	let req = new XMLHttpRequest();
	req.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			window.location.href = window.location.href;
		}
	}

	req.open("PUT", window.location.href);
	req.setRequestHeader("Content-Type","application/JSON");
	req.send(JSON.stringify({selectedValue}));
}