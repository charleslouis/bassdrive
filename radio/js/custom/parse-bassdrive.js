'use strict';

//////////////////////////////////////////////
//
//  Get the tracks of each shows on each day
//
//////////////////////////////////////////////
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

$( document ).ready(function() {
	var baseUrl = 'http://archives.bassdrivearchive.com';

	function getDaysShowsTracks(){
	  $.ajax({
		url: baseUrl,
		async: false,
		type: 'GET',
		success: function(res) {
			var bassDriveDaysLinks = $(res.responseText).find('a');
			var showDays = [];
		  
			//loop through each weekday
			bassDriveDaysLinks.each(function(){
			  // days go from "1 - Monday" to 7 - Sunday" and are written like so
			  // Hence we check if the text of the link starts with a number greater than 0 and lesser than 7
			  if ( this.outerText.charAt(0) > 0 && this.outerText.charAt(0) <= 7 ){
				var day = {pathname:"", shows:[], text:"", url:""};
				day.text = this.outerText; 
				day.pathname = this.pathname;
				day.url = baseUrl + this.pathname;

				//in each day, get the shows
				$.ajax({
					url: day.url,
					async: false,
					type: 'GET',
					success: function(res) {
						var bassDriveShowsLinks = $(res.responseText).find('a');
						var shows = [];

						bassDriveShowsLinks.each(function(){

						  var show = {artist:"", name:"", text:"", pathname:"", time:"", tracks:[], url:""};

						  // we don't really need to index parent directory
						  if( $(this).attr("href") != "/"){
						 
							  show.text = this.outerText;
							
							  var textComponents;
							
							  // if text can be split, then tries to separate DJ and Show names
							  if (this.outerText.indexOf("-") > -1){
								textComponents = this.outerText.split('-');    
								show.artist = textComponents[1].trim().replace(/\/$/, "");
								show.name = textComponents[0].trim().replace(/\/$/, "");

							  } else {
							  // use the same text for both DJ and Show
								textComponents = this.outerText;
								show.artist = textComponents.trim().replace(/\/$/, "");
								show.name = textComponents.trim().replace(/\/$/, "");

							  }
							
							  show.pathname = $(this).attr("href");
							  show.url = day.url +  $(this).attr("href");
							
							  //in each show, get the tracks
							  $.ajax({
								  url: show.url,
								  async: false,
								  type: 'GET',
								  success: function(res) {
									  var bassDriveTracksLinks = $(res.responseText).find('a');
									  var songs = [];
									
									  bassDriveTracksLinks.each(function(){

										var song = {date:"", name:"", text:"", pathname:"", url:""};
										
										// we don't really need to index parent directory
										if( $(this).attr("href") != "/"){                                      
										  var songText = this.outerText;
										  song.show = show.name;
										  song.date = songText;
										  song.text = songText;
										  song.pathname = $(this).attr("href");
										  song.url = show.url.replace(/\/$/, "/") +  $(this).attr("href");

										  if(song.text != ' Parent Directory'){
										  	songs.push(song);                                                                          
										  }

										}//endif                                   
									  
									  });//end each
									  
									  show.songs = songs;                              
									
									}// end success
							  }); //end ajax 
							  shows.push(show);
							
						  }// endif
				
						});//end foreach
						day.shows = shows;
					}//end success
				});//end ajax
				showDays.push(day);
				// console.log(showDays);    
			  }//endif

			});//end for each
		  
			setTimeout(function(){
			  localStorage.setItem('showDays', JSON.stringify(showDays)); 
			}, 15000);
		}
	  });  
	}


	getDaysShowsTracks();
});