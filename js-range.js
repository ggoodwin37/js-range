module.exports = (function() {

	function listNode(type, val) {
		this.type = type;
		this.val = val;
	}

	listNode.prototype.isStart = function() {
		return this.type == 'start';
	}

	listNode.prototype.isEnd = function() {
		return this.type == 'end';
	}

	function jsRange() {
		this.list = [];
	}

	jsRange.prototype._removeRedundant = function() {
		var newList = [], i;
		var redundant;
		for (i = 0; i < this.list.length; ++i) {
			if (i == this.list.length - 1) {
				newList.push(this.list[i]);
			} else {
				var redundant = (this.list[i].val == this.list[i + 1].val && this.list[i].isEnd() && this.list[i + 1].isStart());
				if (redundant) {
					i++;  // skip next one (the redundant start) too.
				} else {
					newList.push(this.list[i]);
				}
			}
		}
		this.list = newList;
		return this;
	}

	jsRange.prototype._normalizeUnion = function() {
		var newList = [], i;
		var lastType = 'end';  // because our first marker should be a start.

		// consolidate start nodes backwards and end nodes forward
		for (i = 0; i < this.list.length; ++i) {
			if (lastType == 'end') {
				if (this.list[i].isStart()) {
					newList.push(this.list[i]);
					lastType = 'start';
				}
			} else {
				if (this.list[i].isEnd()) {
					if (i == this.list.length - 1 || this.list[i + 1].isStart()) {
						newList.push(this.list[i]);
						lastType = 'end';
					}
				}
			}
		}
		this.list = newList;
		return this._removeRedundant();
	}

	jsRange.prototype._insert = function(node) {
		this.list.push(node);
		this.list.sort(function(a, b) {
			if (a.val < b.val) {
				return -1;
			} else if (b.val < a.val) {
				return 1;
			}

			if (a.isEnd() && b.isStart()) {
				return -1;
			} else if (a.isStart() && b.isEnd()) {
				return 1;
			}
			return 0;
		});
		return this;
	}

	jsRange.prototype.clear = function() {
		this.list = [];
		return this;
	}

	jsRange.prototype.debug = function() {
		var outStr = '';
		this.list.forEach(function(thisNode) {
			if (thisNode.isStart()) {
				outStr += '' + thisNode.val + '..';
			} else {
				outStr += '' + thisNode.val + ', ';
			}
		});
		console.log(outStr);
		return this;
	}

	jsRange.prototype.trackRange = function(start, end) {
		if (end <= start) return;

		var startNode = new listNode('start', start);
		var endNode = new listNode('end', end);
		return this._insert(startNode)._insert(endNode)._normalizeUnion();
	}

	jsRange.prototype.deleteRange = function(start, end) {
		var newList = [], i, thisStart, thisEnd;
		for (i = 0; i < this.list.length; i += 2) {
			thisStart = this.list[i];
			thisEnd = this.list[i + 1];
			if (!thisStart.isStart() || !thisEnd.isEnd()) {
				console.log('unexpected range marker types during delete, something is Wrong.');
				return;
			}

			// check for untouched ranges
			if (thisEnd.val <= start || thisStart.val >= end) {
				newList.push(thisStart);
				newList.push(thisEnd);
				continue;
			}

			// check for wholly deleted ranges
			if (thisStart.val >= start && thisEnd.val <= end) {
				// don't copy either marker
				continue;
			}

			// check for a range which completely overlaps the deleted range
			if (thisStart.val < start && thisEnd.val > end) {
				newList.push(thisStart);
				newList.push(new listNode('end', start));
				newList.push(new listNode('start', end));
				newList.push(thisEnd);
				continue;
			}

			// check for a range that straddles the left border of the delete region
			if (thisStart.val < start && thisEnd.val <= end) {
				newList.push(thisStart);
				newList.push(new listNode('end', start));
				continue;
			}

			// check for a range that straddles the right border of the delete region
			if (thisStart.val < end && thisEnd.val > end) {
				newList.push(new listNode('start', end));
				newList.push(thisEnd);
				continue;
			}
		}
		this.list = newList;
		return this;
	}

	jsRange.prototype._getInsertPoints = function(start, end) {
		if (this.list.length < 2) return {start: -1, end: -1};

		var i;
		var startIndex = -1, endIndex = -1;
		for (i = 0; i < this.list.length; ++i) {
			if (this.list[i].val >= end) {
				endIndex = i;
				break;
			}
		}

		for (i = this.list.length - 1; i >= 0; --i) {
			if (this.list[i].val <= start) {
				startIndex = i;
				break;
			}
		}
		return {start: startIndex, end: endIndex};
	}

	jsRange.prototype.queryRange = function(start, end, debug) {
		var insertPoints = this._getInsertPoints(start, end);
		if (debug) {
			this.debug();
			console.log('start=' + start + ' startIndex=' + insertPoints.start + ' end=' + end + ' endIndex=' + insertPoints.end);
		}

		if (insertPoints.start == -1) return false;
		if (insertPoints.end == -1) return false;
		if (this.list[insertPoints.start].type != 'start') return false;
		if (this.list[insertPoints.end].type != 'end') return false;

		return (insertPoints.start + 1 == insertPoints.end);
	}

	return jsRange;
})();
