/**
 * v1.0
 *
 * Madden exact target landing page tracking
 *
 * Use this script in conjunction with the accompanying confimration page script
 *
 *  NOTE: The confirmation page needs the confimration page script to write a tracking pixel to the page
 *
 *  place this script on the email landing page after a user has clicked on a link form the email
 *  This script will look for parameters passed from the email and write that information to cookies 
 *  that will be later sent to the tracking pixel.
 *
 *  email link parameters are as follows:
 * ?mid=%%MemberID%%&j=%%jobid%%&l=%%list_%%&e=%%emailaddr%%&u=%%JobURLID%%&jb=%%_JobSubscriberBatchID%%
 */

// Exact target tracking cookie
//Set the number of days before your cookie should expire
var ExpireDays = 90;
//Do not change anything below this line
qstr = document.location.search;
qstr = qstr.substring(1,qstr.length);
function SetExactTargetCookie(cookieName,cookieValue,nDays) {
	var today = new Date();
	var expire = new Date();
	if (nDays==null || nDays==0) nDays=1;
	expire.setTime(today.getTime() + 3600000*24*nDays);

	// strip off the subdomain if the length of the domain parts is greater than 2
	var parts = document.location.hostname.split('.');
	if(parts.length > 2) { parts.shift(); }
	var domain = parts.join('.');

	document.cookie = cookieName + "=" + escape(cookieValue) + "; expires=" + expire.toGMTString() + "; path=/;domain=" + domain;
}
  
thevars = qstr.split("&");
for(i=0;i<thevars.length;i++)
{
    cookiecase = thevars[i].split("=");
    switch(cookiecase[0])
    {
        case "e":
            e = cookiecase[1];
            SetExactTargetCookie("EmailAddr",e,ExpireDays);
            break;
        case "j":
            j = cookiecase[1];
            SetExactTargetCookie("JobID",j,ExpireDays);
            break;
        case "l":
            l = cookiecase[1];
            SetExactTargetCookie("ListID",l,ExpireDays);
            break
        case "jb":
            jb = cookiecase[1];
            SetExactTargetCookie("BatchID",jb,ExpireDays);
            break;
        case "u":
            u = cookiecase[1];
            SetExactTargetCookie("UrlID",u,ExpireDays);
            break;
        case "mid":
            mid = cookiecase[1];
            SetExactTargetCookie("MemberID",mid,ExpireDays);
            break;
        default:
            break;
    }
}