//=============================================================================
//SkillMessageTargetName.js
// Version: 1.0 - The Re-Remake
//=============================================================================

/*:
 * @plugindesc Using %2 in the battle message
 * will show the target's name(s).
 * @author Rexal
 *
 */

Window_BattleLog.prototype.startAction = function(subject, action, targets) {
var item = action.item();
this.push('performActionStart', subject, action);
this.push('waitForMovement');
this.push('performAction', subject, action);
this.push('showAnimation', subject, targets.clone(), item.animationId);
this.displayAction(subject, item,targets);
};

Window_BattleLog.prototype.displayAction = function(subject, item,targets) {
var numMethods = this._methods.length;
    var target = "";
    for(var i = 0; i<targets.length-1; i++){
    if(i!=0)target += ', '+ targets[i].name();
    else target += targets[i].name() + " ";
    }
    if(targets.length!=1)target += 'and ' + targets[targets.length-1].name(); else target += targets[0].name();
    
if (DataManager.isSkill(item)) {
if (item.message1) {
this.push('addText', subject.name() + item.message1.format(item.name,target));
}
if (item.message2) {
this.push('addText', item.message2.format(item.name,target));
}
} else {
this.push('addText', TextManager.useItem.format(subject.name(), item.name,target));
}
if (this._methods.length === numMethods) {
this.push('wait');
}
};
 
if(Imported.YEP_BattleEngineCore){
	
	BattleManager.actionDisplayAction = function() {
    this._logWindow.displayAction(this._subject, this._action.item(), this._targets);

    return false;
};

Window_BattleLog.prototype.startAction = function(subject, action, targets) {
};

Yanfly.BEC.Window_BattleLog_displayAction = Window_BattleLog.prototype.displayAction;
Window_BattleLog.prototype.displayAction = function(subject, item,targets) {
    if (eval(Yanfly.Param.BECFullActText)) {
      Yanfly.BEC.Window_BattleLog_displayAction.call(this, subject, item,targets);
    } else {
      this._actionIcon = item.iconIndex;
      this.push('addText', '<SIMPLE>' + item.name);
      if (item.message2) {
        this.push('addText', '<CENTER>' + item.message2.format(item.name));
      }
    }
};


}

