import Seed from './src/main.js'

 (function(){
   var app = Seed.create({
       id: 'test',
       // template
       scope: {
           msg: 'hello',
           hello: 'WHWHWHW',
           changeMessage: function () {
               app.scope.msg = 'hola'
           }
       }
   })
 })()
