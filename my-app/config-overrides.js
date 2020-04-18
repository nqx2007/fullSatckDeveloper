

const {override,fixBabelImports}= require ("customize-cra");
module.exports= override(
    fixBabelImports("import",{
        libraryname:'antd',
        libraryDirectory:'es',
        style:'css'
    })
)