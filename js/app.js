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
    dbg('setInk: '+c)
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

cApp.prototype.getDistance = function(id1, id2){
    let res = this.getCoord(id1)
    const y1 = res[0], x1 = res[1]
    res = this.getCoord(id2)
    const y2 = res[0], x2 = res[1]
    return (y2-y1)*(y2-y1) + (x2-x1)*(x2-x1)
}

//----------------------------------------------------------
cApp.prototype.drawField = function()
{
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
cApp.prototype.clickCellProc = function(ctx)
{
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
    for (let i=0; i<res.length; i++) {
        v = res.eq(i)
        const id = v.attr('id')
        const cl = v.attr('class')
        //dbg(id+' : '+cl)
        cores[id] = cl.substring(4)
    }
    //dbg(cores)
    return cores
}

cApp.prototype.resetField = function() {
    dbg(':resetField()')
    this.area.find('div').removeClass()
}

cApp.prototype.classify = function (cores, id) {
    if (id in cores) return 'core'+cores[id]
    let distance = 10000
    let cl = null
    let is_dual = false
    for (k in cores) {
        const d1 = this.getDistance(k, id)
        //dbg(d1)
        if (d1 == distance && cl != cores[k]) {
            // is_dual
            cl = null
        }
        if (d1 < distance) {
            distance = d1
            cl = cores[k]
        }
    }
    //dbg(id + '-> ' + cl)
    return 'area'+cl
}

cApp.prototype.renderAreas = function() {
    const cores = this.getCores()
    // dbg(cores.length)
    // if (cores.length < 1) {
    //     this.resetField()
    //     return
    // }
    const cfg = this.cfg
    for (let i=0; i<cfg.SizeY; i++)
        for (let j=0; j<cfg.SizeX; j++)
        {
            const id = this.getId(i, j)
            cl = this.classify(cores, id)
            const o = this.area.find('#'+id)
            o.removeClass()
            if (cl) o.addClass(cl)
        }
}

//----------------------------------------------------------
cApp.prototype.fillTpl = function()
{
    var cfg = this.cfg
    var area = this.area
    area.find('div').removeClass()
    for (var i=0; i<cfg.SizeY; i++)
        for (var j=0; j<cfg.SizeX; j++)
        {
            id = this.getId(i,j)
            if ( !(i&1) && !(j&1) ) area.find('#'+id).addClass('c1')
        }
}
