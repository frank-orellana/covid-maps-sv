import config from "./config";
import Hammer from 'hammerjs';

export async function obtenerJson(url: string, params: RequestInit = {method: "post",mode:"cors"}): Promise<any>{
	//console.log("fetching", config.api_url + url, params);
	const resp = await fetch(config.api_url + url, params);
	if(resp.status == 200){
		const json = await resp.json();
		//console.log('response:', json);
		return json;
	}else{
		return {error: resp.status}
	}
}

export function cleanUpSpecialChars(str: string) : string {
	return str
		.toLowerCase()
		.replace(/[àáâãäå]/gi, "a")
		.replace(/[èéê]/gi, "e")
		.replace(/[ìíî]/gi, "i")
		.replace(/[òóô]/gi, "o")
		.replace(/[ùúû]/gi, "u")
		.replace(/[ñ]/gi, "n")
		.replace(/[^a-z0-9 ]/gi, ""); // final clean up
}

export async function sleep(ms:number) : Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export class Player {
	playing = false;
	paused = false;
  estadoRep = "";
  idx = 0;
  max = 0;
  timeout: number = -1;
  delay = 30;
  callback: Function;
  constructor(callback: Function,delay : number = 30){
    this.delay = delay;
    this.callback = callback;
  }
  play() : void {
		this.playing = true;
		this.paused = false;

    if(this.idx <= this.max)
      try{this.callback();}catch(e){console.log(e);};
    
    if(this.idx < this.max){
			this.idx++;
			const _self = this;
      this.timeout = setTimeout(() => this.play(),this.delay,[this.callback]);
    }else
      this.stop();
  }
  stop() : void {
		this.playing = false;
    this.idx = 0;
    clearTimeout(this.timeout);
  }
  pause() : void {
		clearTimeout(this.timeout);
		this.paused = true;
  }
}

let hammer: HammerManager;

export const eventsHandler = {
	haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
, init: function(options:any) : void {
		var instance = options.instance
			, initialScale = 1
			, pannedX = 0
			, pannedY = 0

		// Init Hammer
		// Listen only for pointer and touch events
		hammer = new Hammer(options.svgElement, {
			///@ts-ignore
			inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
		})

		// Enable pinch
		hammer.get('pinch').set({enable: true})

		// Handle double tap
		hammer.on('doubletap', function(ev : HammerInput) : void {
			instance.zoomIn()
		})

		// Handle pan
		hammer.on('panstart panmove', function(ev : HammerInput) : void {
			// On pan start reset panned variables
			if (ev.type === 'panstart') {
				pannedX = 0
				pannedY = 0
			}

			// Pan only the difference
			instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
			pannedX = ev.deltaX
			pannedY = ev.deltaY
		})

		// Handle pinch
		hammer.on('pinchstart pinchmove', function(ev : HammerInput) : void {
			// On pinch start remember initial zoom
			if (ev.type === 'pinchstart') {
				initialScale = instance.getZoom()
				instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
			}

			instance.zoomAtPoint(initialScale * ev.scale, {x: ev.center.x, y: ev.center.y})
		})

		// Prevent moving the page on some devices when panning over SVG
		options.svgElement.addEventListener('touchmove', function(e:Event) : void { e.preventDefault(); });
	}

, destroy: function() : void {
		hammer.destroy()
	}
}