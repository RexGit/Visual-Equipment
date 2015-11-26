//=============================================================================
// BattlersEnhanced.js
// Version: 0
//=============================================================================

var Imported = Imported || {};
Imported.BattlersEnhanced = true;

var Rexal = Rexal || {};
Rexal.BE = Rexal.BE || {};
/*:
 * @plugindesc Version: 0 - Pre-Alpha
 * - THIS IS A WIP
 * @author Rexal
 *


 
  * @help

 --------------------------------------------------------------------------------
 Notetags
 ================================================================================
 
 --------------------------------------------------------------------------------
 Version Log
 ================================================================================
  
 v1 - Initial Version

 */
 
 Rexal.BE.Parameters = PluginManager.parameters('animatedSVEnemies');
 
 
  //-----------------------------------------------------------------------------
 // Sprite_Actor
//=============================================================================
Rexal.BE.updateframe = Sprite_Actor.prototype.updateFrame;



Sprite_Actor.prototype.startMotion = function(motionType) {
	
	if(this._motionsRex){Rexal.BE.processActorSpriteNoteTag($dataActors[this._actor.actorId()],this); }
	else{
		this._motionsRex = {
    walk:     { index: 0,  loop: true  },
    wait:     { index: 1,  loop: true  },
    chant:    { index: 2,  loop: true  },
    guard:    { index: 3,  loop: true  },
    damage:   { index: 4,  loop: false },
    evade:    { index: 5,  loop: false },
    thrust:   { index: 6,  loop: false },
    swing:    { index: 7,  loop: false },
    missile:  { index: 8,  loop: false },
    skill:    { index: 9,  loop: false },
    spell:    { index: 10, loop: false },
    item:     { index: 11, loop: false },
    escape:   { index: 12, loop: true  },
    victory:  { index: 13, loop: true  },
    dying:    { index: 14, loop: true  },
    abnormal: { index: 15, loop: true  },
    sleep:    { index: 16, loop: true  },
    dead:     { index: 17, loop: true  }
}
Rexal.BE.processActorSpriteNoteTag($dataActors[this._actor.actorId()],this)
	}
    var newMotion = this._motionsRex[motionType];
    if (this._motion !== newMotion) {
        this._motion = newMotion;
        this._motionCount = 0;
        this._pattern = 0;
    }
	
};

 Sprite_Actor.prototype.updateFrame = function() {

    Rexal.BE.updateframe.call(this);
    var bitmap = this._mainSprite.bitmap;
    if (bitmap) {
        var motionIndex = this._motion ? this._motion.index : 0;
        var pattern = this._pattern < this._frames ? this._pattern : this._frames-1;
        var cw = bitmap.width / (this._frames * this._columns);
        var ch = bitmap.height / this._motions;
        var cx = Math.floor(motionIndex / this._motions) * this._frames + pattern;
        var cy = motionIndex % this._motions;
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
    }
};


if (Imported.AnimatedSVEnemies) {
	
	Sprite_EnemyRex.prototype.startMotion = function(motionType) {
	
	if(this._motionsRex)Rexal.BE.processActorSpriteNoteTag($dataEnemies[this._actor.enemyId()],this); 
		else{
		this._motionsRex = {
    walk:     { index: 0,  loop: true  },
    wait:     { index: 1,  loop: true  },
    chant:    { index: 2,  loop: true  },
    guard:    { index: 3,  loop: true  },
    damage:   { index: 4,  loop: false },
    evade:    { index: 5,  loop: false },
    thrust:   { index: 6,  loop: false },
    swing:    { index: 7,  loop: false },
    missile:  { index: 8,  loop: false },
    skill:    { index: 9,  loop: false },
    spell:    { index: 10, loop: false },
    item:     { index: 11, loop: false },
    escape:   { index: 12, loop: true  },
    victory:  { index: 13, loop: true  },
    dying:    { index: 14, loop: true  },
    abnormal: { index: 15, loop: true  },
    sleep:    { index: 16, loop: true  },
    dead:     { index: 17, loop: true  }
}
Rexal.BE.processActorSpriteNoteTag($dataEnemies[this._actor.enemyId()],this); 
	}
    var newMotion = this._motionsRex[motionType];
    if (this._motion !== newMotion) {
        this._motion = newMotion;
        this._motionCount = 0;
        this._pattern = 0;
    }
	
};
	
	Sprite_Actor.prototype.motionSpeed = function() {
    return this._speed;
};
	
	Sprite_Actor.prototype.updateMotionCount = function() {
    if (this._motion && ++this._motionCount >= this.motionSpeed()) {
        if (this._motion.loop) {
            this._pattern = (this._pattern + 1) % this._frames;
        } else if (this._pattern < this._frames) {
            this._pattern++;
        } else {
            this.refreshMotion();
        }
        this._motionCount = 0;
    }
};
	
}

  //-----------------------------------------------------------------------------
// Rex Functions
//=============================================================================


Rexal.BE.processActorSpriteData = function(obj,obj2) {
}

Rexal.BE.processActorSpriteNoteTag = function(obj,sprite) {

sprite._frames = 3;
sprite._motions = 6;
sprite._columns = 3;
sprite._isenhanced = false;
sprite._scale = 1;
sprite._speed = 12;
if(obj == null)return;

		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		var lines = line.split(': ');
		
		switch (lines[0].toLowerCase()) {
	
		
		case 'battler frames' :
		sprite._isenhanced = true;
        sprite._frames = parseInt(lines[1]);
		break;
		
		case 'frame speed' :
		sprite._isenhanced = true;
        sprite._speed = parseInt(lines[1]);
		break;	

		case 'battler rows' :
		sprite._isenhanced = true;
        sprite._motions = parseInt(lines[1]);
		break;
		
		case 'battler columns' :
		sprite._isenhanced = true;
        sprite._columns = parseInt(lines[1]);
		break;
		
			case 'battler scale' :
			sprite._isenhanced = true;
        sprite._scale = parseFloat(lines[1]);
		break;	
		
			case 'battler motion' :
			sprite._isenhanced = true;
			var lines2 = lines[1].split(',');
			sprite._motionsRex[lines2[0]].index = parseInt(lines2[1])-1;
			sprite._motionsRex[lines2[0]].loop = eval(lines2[2]);
		break;	
		
		}
		
			
		}
		return obj;
};



