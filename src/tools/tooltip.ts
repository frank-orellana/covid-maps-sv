
export class Tooltip {
	idElement: string;
	element: HTMLElement;
	constructor(idElement:string){
		this.idElement = idElement;
		this.element = document.getElementById(idElement) as HTMLElement;
		if(this.element == null)
			console.error(idElement,' not Found!');
	}
	showTooltip(evt: MouseEvent) :void {
		if(this.element != null){
			this.element.style.display = "block";
			this.element.style.left = evt.pageX + 10 + 'px';
			this.element.style.top = evt.pageY + 10 + 'px';
		} else {
			console.error(`#${this.idElement} element not found`);
		}
	};
	
	hideTooltip() : void {
		if(this.element != null)
			this.element.style.display = "none";
	}
}

