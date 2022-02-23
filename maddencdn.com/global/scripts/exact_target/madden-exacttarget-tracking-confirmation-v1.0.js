/**
 * v1.0
 *
 * Madden exact target conversion page tracking
 *
 * Use this script in conjunction with the accompanying landing page script
 *
 *  NOTE: The landing page needs the landing page script to set the cookies this script reads
 *
 *  place this script on the conversion (or thank you) page after a user has entered the contest
 *  This script will then write a tracking pixel using parameters written by exact target
 */


//Set the following parameters for your conversion parameters
var convid="1";
var displayorder="1";
var linkalias="My Link Name";
var dataset="<data amt=\"1\" unit=\"Downloads\" accumulate=\"true\" />";

//For additional datasets, simply add them to the concatenation:
//dataset=dataset+"<data amt=\"1\" unit=\"Dollars\" accumulate=\"true\">
//Do not change anything below
function getCookie(cookiename)
{
    if(document.cookie.length >0)
    {
        startC = document.cookie.indexOf(cookiename+"=");
        if (startC != -1)
        {
            startC += cookiename.length+1;
            endC = document.cookie.indexOf(";",startC);
            if(endC ==-1) endC = document.cookie.length;
            return unescape(document.cookie.substring(startC,  endC));
        }
     }
     return null;
}
var jobid = getCookie("JobID");
var emailaddr = getCookie("EmailAddr");
var listid = getCookie("ListID");
var batchid = getCookie("BatchID");
var urlid = getCookie("UrlID");
var memberid = getCookie("MemberID");
//Debug
//document.write("<textarea rows=5 cols=80>");
document.write("<img src='");
document.write("http://click.exacttarget.com/conversion.aspx?xml=<system><system_name>tracking</system_name><action>conversion</action>");
document.write("<member_id>"+memberid+"</member_id>");
document.write("<job_id>"+jobid+"</job_id>");
document.write("<email>"+emailaddr+"</email>");
document.write("<list>"+listid+"</list>");
document.write("<BatchID>"+batchid+"</BatchID>");
document.write("<original_link_id>"+urlid+"</original_link_id>");
document.write("<conversion_link_id>"+convid+"</conversion_link_id>");
document.write("<link_alias>"+linkalias+"</link_alias>");
document.write("<display_order>"+displayorder+"</display_order>");
document.write("<data_set>"+dataset+"</data_set>");
document.write("</system>'");
document.write(" width='1' height='1'>");
//Debug  //document.write("</textarea>");