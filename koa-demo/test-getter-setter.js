const kkb={
    info:{
        quanzhan:1220,
        gaiji:1390
    },
    get quanzhan(){
        return this.info.quanzhan
    },
    set name(value){
        this.info.name=value
    }
}
console.log(kkb.quanzhan)
// kkb.quanzhan=456
// console.log(kkb.quanzhan)