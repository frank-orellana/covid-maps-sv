
export class Tooltip {
	static element: HTMLElement|null = null;
	static showTooltip = function(evt: MouseEvent/*, text: string*/) {
		if(Tooltip.element == null)
			Tooltip.element = document.getElementById("tooltip");
		
		if(Tooltip.element != null){
			//Tooltip.element.innerHTML = text;
			Tooltip.element.style.display = "block";
			Tooltip.element.style.left = evt.pageX + 10 + 'px';
			Tooltip.element.style.top = evt.pageY + 10 + 'px';
		} else {
			console.error('#tooltip element not found');
		}
	};
	
 static hideTooltip = function() {
		if(!Tooltip.element)
			Tooltip.element = document.getElementById("tooltip");
		
		if(Tooltip.element != null)
			Tooltip.element.style.display = "none";
	}
}

