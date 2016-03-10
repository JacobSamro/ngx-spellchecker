
// Load modules.
var fs = require('fs');
const StripBOM = require('strip-bom');

// Read parameters.
var input_file = process.argv.length > 2? process.argv[2] : null;
var output_file = process.argv.length > 3? process.argv[3] : input_file;

// Validate parameters.
if(input_file != null) {
    if(fs.existsSync(input_file)) {
        console.log("Reading file...");
        var content = fs.readFileSync(input_file, 'utf8');
        content = StripBOM(content);
        content = content.replace(/\r/g, '');

        console.log("Sorting lines...");
        var lines = content.split('\n');      
        var collator = new Intl.Collator(); // Use this comparator for consider accents and special characters.
        lines = lines.sort(collator.compare);
        
        var newContent = '';  
        var first = true;
        for(var i=0; i<lines.length; i++) {          
            if(lines[i] != '' && lines[i] != '\n') {
                if(!first) newContent += '\n';
                newContent += lines[i];
                first = false;
            }
        }

        console.log("Writing file...");
        fs.writeFileSync(output_file, newContent, 'utf8');
    } else {
        console.log("ERROR: The input file do not exists.");
    }
} else {
    console.log("ERROR: The input file has not been defined.");
}

console.log("Done");

