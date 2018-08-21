function dbg(s) {
    console.log(s)
}
//==============================================================================
//----------------------------------------------------------
function cApp()
{
    this.init()
}

cApp.prototype.setInk = function (c) {
    // dbg('setInk: '+c)
    this.ink = c
    // const id = 'ink' + c
    // dbg('id:'+id)
    // $('#'+id).attr('checked', true)
}
//----------------------------------------------------------
cApp.prototype.init = function()
{
    const self = this
    this.cfg = {SizeX: 50, SizeY: 50}
    var area = $('#field')
    this.area = area
    this.drawField()
    area.find('div').click( function(){
        self.clickCellProc(this)
    })
    this.setInk('A')
    $('#panel input[name=ink]').click(function(){
        const ink = $(this).val()
        self.setInk(ink)
    })
    $('#clear-btn').click(()=>{
        self.resetField()
    })
    $('#15_23').addClass('coreA')
    $('#26_32').addClass('coreB')
    $('#27_14').addClass('coreC')
    this.renderAreas()
}

//----------------------------------------------------------
cApp.prototype.getCoord = function(id)     { return id.split('_') }

//----------------------------------------------------------
cApp.prototype.getId    = function(y,x)    { return y+'_'+x }

cApp.prototype.getDistanceSqr = function(id1, id2) {
    const [y1, x1] = this.getCoord(id1)
    const [y2, x2] = this.getCoord(id2)
    return (y2-y1)*(y2-y1) + (x2-x1)*(x2-x1)
}

//----------------------------------------------------------
cApp.prototype.drawField = function() {
    var cfg = this.cfg
    var area = this.area
    var ss = ''
    var s, id
    for (var i=0; i<cfg.SizeY; i++)
        for (var j=0; j<cfg.SizeX; j++)
        {
            id = this.getId(i,j)
            s = '<div id="'+id+'"></div>'
            ss += s
        }
    area.html(ss)
}

//----------------------------------------------------------
cApp.prototype.clickCellProc = function(ctx) {
    var self = $(ctx)
    var id = self.attr('id')
    cl = 'core'+this.ink
    // dbg(cl)
    if ( self.hasClass(cl) ) {
        self.removeClass(cl)
    } else {
        self.removeClass()
        self.addClass(cl)
    }
    this.renderAreas()
}

cApp.prototype.getCores = function () {
    const res = this.area.find('.coreA, .coreB, .coreC')
    //dbg(res.length)
    cores = {}
    groups = {'A': [], 'B': [], 'C':[]}
    for (let i=0; i<res.length; i++) {
        v = res.eq(i)
        const id = v.attr('id')
        const cls = v.attr('class')
        //dbg(id+' : '+cl)
        const cl= cls.substring(4)
        cores[id] = cl
        groups[cl].push(id)
    }
    // dbg(cores)
    // dbg(groups)
    return [cores, groups]
}

cApp.prototype.resetField = function() {
    // dbg(':resetField()')
    this.area.find('div').removeClass()
}

cApp.prototype.classify = function (cores, groups, id) {
    if (id in cores) return 'core'+cores[id]
    max_field = 0
    cl = null
    for (k in groups) {
        let sum = 0
        for (let i=0; i<groups[k].length; i++) {
            const core = groups[k][i]
            sum += 1/this.getDistanceSqr(core, id)
        }
        if (sum > max_field) {
            [max_field, cl] = [sum, k]
        } else if ( sum == max_field) {
            cl = null
        }
    }
    if (cl) return 'area'+cl
    return null
}

cApp.prototype.renderAreas = function() {
    const [cores, groups] = this.getCores()
    if (!Object.keys(cores).length) {
        this.resetField()
        return
    }
    const cfg = this.cfg
    for (let i=0; i<cfg.SizeY; i++)
        for (let j=0; j<cfg.SizeX; j++)
        {
            const id = this.getId(i, j)
            cl = this.classify(cores, groups, id)
            const o = this.area.find('#'+id)
            o.removeClass()
            if (cl) o.addClass(cl)
        }
}
