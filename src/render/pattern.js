import Actor from './actor';

/**
 * class for rendering static element
 * @extends Actor
 */
class Pattern extends Actor {
	constructor(props) {
		props = props || {};
		super(props);
	}
	
	getName() {
		return this._assetData.DATA.NAME;
	}
	
	initResources(resources) {
		let resource = resources[this.getName()];
		
		this._sprite = new PIXI.Sprite(resource.texture);
		
		this._sprite.anchor.set(0.5, 0.5);
		
		this._sprite.position.x = this._initPosition.x;
		this._sprite.position.y = this._initPosition.y;
		
		this._initMouseEvent();
		
		return this;
	}
	
	_initMouseEvent(){
		if (this._onClick) {
			this._sprite.interactive = true;
			this._sprite.mousedown = (e) => {
				this._onClick(e);
			};
			this._sprite.cursor = null;
		}
	}
}

export default Pattern;