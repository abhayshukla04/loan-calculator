addEventListener('keydown',function(event)
{
	if(event.keyCode==13) 
	{
		EMI();
	}
});

function monthly()
{
   this.convertRate=function(rate)
   {
     return rate/(12*100);
   };
   this.convertTime=function(time)
   {
     return time*12;
   };
   this.monthlyPrincipal=function(emi,rate,time)
   {
     var power=Math.pow(1+rate,time);
     return emi*(power-1)/(rate*power);
   };
}
 
function loan(p,r,t)
{
   this.principal=p;
   this.rate=r;
   this.time=t;
}
 
loan.prototype=new monthly();
loan.prototype.constructor=loan;
 
function toggleBtn(id)
{
 	var table=document.getElementById('myTable');
 	id=id*1;
 	var str=document.getElementById(id).innerText;
 	if(str[0]=="+")
 	{
 		for(var idx=1;idx<=12 && (idx+id)<table.rows.length;idx++)
 		{
			table.rows[id+idx].style.removeProperty("display");
 		}
 		str="-" + str.substr(1);
 	}
 	else
 	{
 		for(var idx=1;idx<=12 && (idx+id)<table.rows.length;idx++)
 		{
			table.rows[id+idx].style.display="none";
 		}
 		str="+" + str.substr(1);
 	}
 	document.getElementById(id).innerText=str;
}

function EMI()
{
        var p=document.getElementById("principal").value;
        var r=document.getElementById("rate").value;
        var t=document.getElementById("tenure").value;
        var y=document.getElementById("monthYear").value;
		p=p*1;r=r*1;t=t*1;
        
        if(p=="")
        	alert("Loan amount can't be empty!");
        else if(isNaN(p))
        	alert("Enter a valid loan amount!");
        else if(r=="")
        	alert("Interest rate can't be empty!");
        else if(isNaN(r))
        	alert("Enter a valid interest rate!");
        else if(t=="")
        	alert("Loan tenure can't be empty!");
        else if(isNaN(t))
        	alert("Enter a valid loan tenure!");
        else if(y.length!=4 || isNaN(y*1))
        	alert("Enter a valid year!");
        
        else
        {
	        var l=new loan(p,r,t);
	        var Rate=l.convertRate(l.rate);
	        var Time=l.convertTime(l.time);
	        
	        var numerator=(l.principal * Rate * Math.pow((1+Rate),Time));
	        var denominator=(Math.pow((1+Rate),Time)-1);
	        var emi=numerator/denominator; 
	        
	        var emi=emi.toFixed();
	        document.getElementById("emi").value=emi;
	       
	        var pay=(emi*Time).toFixed();
	        document.getElementById("pay").value=pay; 
	       
	        var interest=Math.abs(pay-l.principal).toFixed();
	        document.getElementById("interest").value=interest; 
	        
	        var monthPrincipal=[];
	        var monthInterest=[];
	        var monthBalance=[];
	        var balance=l.principal;
	        for(var i=0;i<Time;i++)
	        {
	            var monthP=l.monthlyPrincipal(emi,Rate,Time-i) - l.monthlyPrincipal(emi,Rate,Time-i-1);
	            monthP=monthP.toFixed();
	            balance=(balance-monthP).toFixed();
		        if(balance>0 && i==Time-1)
		        {
		          	monthP=(monthP*1+balance*1).toFixed();
		           	balance=0;
		        }
		        if(balance<0)
	            	balance=0;
		        monthPrincipal.push(monthP);
				monthInterest.push(Math.abs(emi-monthP).toFixed());
		        monthBalance.push(balance);
	        }
        
	        var timeInYear=Time/12;
	        var j=0;
	        var yearPrincipal=[];
	        var yearInterest=[];
	        var yearBalance=[];
	        balance=l.principal;
	        for(var i=0;i<timeInYear;i++)
	        {
	        	var cnt=0;
	        	var yearP=0;
	        	while(j<Time && cnt<12)
	        	{
	        		cnt++;
	        		yearP=yearP*1+monthPrincipal[j]*1;
	        		j++;
	        	}
	        	yearP=yearP.toFixed();
	        	balance=(balance-yearP).toFixed();
	        	if(balance>0 && i==timeInYear-1)
	            {
	            	yearP=(yearP*1+balance*1).toFixed();
	            	balance=0;
	            }
	            if(balance<0)
	            	balance=0;
	            yearPrincipal.push(yearP);
	        	yearInterest.push(Math.abs(emi*cnt-yearP).toFixed());
	        	yearBalance.push(balance);
	        }
	       
			var table = document.getElementById("myTable");
		    var rowCount = table.rows.length;
		    for (var i=0; i < rowCount; i++) 
		    {
		      	table.deleteRow(0);
	        }
	        var row=table.insertRow(0);
	        row.setAttribute("class","caption");
				
	        var cell1=row.insertCell(0);
	        var cell2 = row.insertCell(1);
	        var cell3 = row.insertCell(2);
	        var cell4=row.insertCell(3);
	        cell1.innerHTML = "YEAR";
	        cell2.innerHTML = "PRINCIPAL";
	        cell3.innerHTML = "INTEREST";
	        cell4.innerHTML = "BALANCE";

	        var cntY=0;
	        var cntM=0;
	        for(var i=0;i<Time+timeInYear;i++)
	        {
	            var row = table.insertRow(i+1); 
	            var cell1 = row.insertCell(0);
	            var cell2 = row.insertCell(1);
	            var cell3 = row.insertCell(2);
	            var cell4 = row.insertCell(3);
	        	var monthName=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	            if(i%13==0)
	            {
	            	row.setAttribute("class","year");
	            	var btn = document.createElement("BUTTON");
	            	var t = document.createTextNode("+  " + y); y++; 
					btn.appendChild(t);
					btn.setAttribute("class","yearBtn");
					btn.setAttribute("id",i+1);
					btn.setAttribute("onClick","toggleBtn(this.id);");
					cell1.appendChild(btn);
					cell2.innerHTML = yearPrincipal[cntY];
		            cell3.innerHTML=yearInterest[cntY];
		            cell4.innerHTML = yearBalance[cntY];
		            cntY++;
				}
				else
				{
					row.setAttribute("class","month");
					table.rows[i+1].style.display="none";
					cell1.innerHTML=monthName[cntM%12];
		            cell2.innerHTML = monthPrincipal[cntM];
		            cell3.innerHTML=monthInterest[cntM];
		            cell4.innerHTML =monthBalance[cntM];
		            cntM++;
		        }
	        }
    	}
}
