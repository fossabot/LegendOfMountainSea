import Perlin from 'loms.perlin';
import Coordinates from '../core/coordinates';
import RandomSeed from '../core/randomSeed';
import S_worldTerrainAsset, {ASSETS_ID} from '../static/terrain/worldTerrainAsset';
import {EXECUTE_IN_CLIENT} from '../util/envUtil';
import Store from '../module/store';

let renderStartingCoordinates = null;
let seed = null;

/**
 * class for connecting data and terrain
 */
class TerrainChain {
	static _initRenderCenter(){
		renderStartingCoordinates = new Coordinates(0,0);

		return this;
	}
	
	static updateRenderStartingCoordinates(coordinates) {
		if (!renderStartingCoordinates) {
			TerrainChain._initRenderCenter();
		}
		
		renderStartingCoordinates.set({
			x: renderStartingCoordinates.x + coordinates.x,
			y: renderStartingCoordinates.y + coordinates.y,
		});
		
		return this;
	}
	
	static getRenderStartingCoordinates() {
		if (!renderStartingCoordinates) {
			TerrainChain._initRenderCenter();
		}
		
		return renderStartingCoordinates;
	}
	
	/**
	 * get terrain asset data for render by render coordinates point
	 * @param renderPoint {Coordinates}
	 * @returns {Object}
	 */
	static getTerrainAssetData(renderPoint) {
		
		if(!seed){
			try {
				EXECUTE_IN_CLIENT(() => {
					seed = Store.getConfig().seed;
				});
			} catch (e) {
				console.error(e);
				seed = new RandomSeed().random();
			}
		}
		
		Perlin.seed(seed);
		
		let vx = renderPoint.x * 0.01,
			vy = renderPoint.y * 0.2;
		
		
		let noise = Perlin.perlin2(vx, vy);
		let height = parseInt((noise * 255)) + 135;
		
		return TerrainChain.getAssetData(TerrainChain.getTerrainType(height));
	}
	
	static getTerrainType(height) {
		let type = null;
		if (height > 200) {
			type = ASSETS_ID.HILL_ID;
		} else if (height > 150) {
			type = ASSETS_ID.FOREST_ID;
		} else if (height > 100) {
			type = ASSETS_ID.RIVER_ID;
		} else {
			type = ASSETS_ID.SWAMP_ID;
		}
		
		return type;
	}
	
	static getAssetData(id) {
		let asset = null;
		switch (id) {
			case ASSETS_ID.FOREST_ID:
				asset = S_worldTerrainAsset.FOREST;
				break;
			case ASSETS_ID.HILL_ID:
				asset = S_worldTerrainAsset.HILL;
				break;
			case ASSETS_ID.RIVER_ID:
				asset = S_worldTerrainAsset.RIVER;
				break;
			case ASSETS_ID.SWAMP_ID:
				asset = S_worldTerrainAsset.SWAMP;
				break;
			default:
				break;
		}
		
		return asset;
	}
}

export default TerrainChain;