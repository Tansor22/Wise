export default {
   methods: {
       checkCondition(condition) {
           if (!condition) return true
           return this.evaluateCondition(condition)
       },
       evaluateCondition(condition) {
           let evaluated
           console.log(condition)
           if (condition.conditions && condition.operator) {
               // recursive call
               evaluated = condition.conditions
                   .map(cond => this.evaluateCondition(cond))
                   .reduce(this.getCallback(condition.operator))
           } else {
               // evaluate OR
               const currentValue = this.getFieldValue(this.requisite, condition.code)
               const currentValueToString = currentValue || (typeof currentValue === "boolean") ? currentValue.toString() : ''
               // there is smth return true, out !true ==> isHidden = false
               evaluated = condition.values.some(value => value.toString() === currentValueToString)
           }
           return condition.inverse ? !evaluated : evaluated
       },
       getCallback(strOperator) {
           let callback
           switch (strOperator) {
               case "&&":
               case "AND":
                   callback = function (x, y) {
                       return x && y
                   };
                   break;
               case "||":
               case "OR":
                   callback = function (x, y) {
                       return x || y
                   };
                   break;
           }
           return callback
       },
       getFieldValue(source, data) {
           if (data.indexOf('.') === -1) {
               return source[data]
           } else {
               const key = data.slice(0, data.indexOf('.'))
               const elsePart = data.slice(data.indexOf('.') + 1)
               source[key] = source[key] || {}
               return this.getFieldValue(source[key], elsePart)
           }
       }
   }
}

