/* Optional integration check: .NET 8 SDK, no external NuGet dependencies. */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawnSync}=require('node:child_process');
const {generate}=require('../dist/csharp-core.js'),directory=fs.mkdtempSync(path.join(os.tmpdir(),'diffora-csharp-'));
const cases=[
 {name:'Response',namespace:'TestCases.Basic',source:'{"users":[{"id":1,"name":"Alper","items":[1,null]},{"id":2147483648,"email":null}],"matrix":[[1,2],[3]],"metadata":null}'},
 {name:'NumericResponse',namespace:'TestCases.Numeric',source:'{"id":9223372036854775807,"fraction":0.1234567890123456789012345678,"large":79228162514264337593543950336,"huge":1e400}'},
 {name:'Root',namespace:'TestCases.Names',source:'{"root":1,"a-b":1,"a_b":2,"123":1,"":"empty","Türkçe":"yes","class":true,"__proto__":{"x":1},"line\\n\\\"\\\\":"value","System":{"string":1},"nested":{"nestedModel":1}}'},
 {name:'Root',namespace:'TestCases.Array',source:'[null,{"id":1,"enabled":true},{"id":null,"values":[{},null]}]'},
 {name:'DateResponse',namespace:'TestCases.Dates',inferDates:true,source:'{"created_at":"2024-02-29T12:30:00.1234567+03:00","other":"2025-02-29T00:00:00Z"}'},
 {name:'BlankNamespace',namespace:'',source:'{"id":1,"values":[[null,1],[]]}'},
 {name:'System',namespace:'TestCases.SystemNames',source:'{"String":{"List":[{"JsonElement":true}]},"System":{},"DateTimeOffset":"text"}'},
];
let program='using System;\nusing System.Text.Json;\n';
for(const [i,c]of cases.entries()){const result=generate(c.source,{className:c.name,namespace:c.namespace,inferDates:c.inferDates});fs.writeFileSync(path.join(directory,'Model'+i+'.cs'),result.code);program+=`var value${i} = JsonSerializer.Deserialize<${result.rootType}>(${JSON.stringify(c.source)})!;\nvar serialized${i} = JsonSerializer.Serialize(value${i});\nusing var checked${i} = JsonDocument.Parse(serialized${i});\n`;}
program+=`if(value0.Users.Count != 2 || value0.Users[1].Id != 2147483648L || value0.Users[1].Name != null || value0.Users[0].Items![1] != null) throw new Exception("Merged nullable fields");
if(value1.Id != 9223372036854775807L || value1.Fraction != 0.1234567890123456789012345678m || value1.Large.GetRawText() != "79228162514264337593543950336" || value1.Huge.GetRawText() != "1e400") throw new Exception("Numeric precision");
using var names = JsonDocument.Parse(${JSON.stringify(cases[2].source)});
foreach(var property in names.RootElement.EnumerateObject()) if(checked2.RootElement.GetProperty(property.Name).GetRawText() != property.Value.GetRawText()) throw new Exception("JSON name preservation: " + property.Name);
if(value3.Count != 3 || value3[0] != null || value3[2]!.Enabled != null) throw new Exception("Array root");
if(value4.CreatedAt.Offset != TimeSpan.FromHours(3) || value4.CreatedAt.Ticks % TimeSpan.TicksPerSecond != 1234567) throw new Exception("Date inference");
Console.WriteLine("PASS: 7 generated models compiled and deserialized; numeric precision, JSON names, nullable lists and DateTimeOffset verified.");\n`;
fs.writeFileSync(path.join(directory,'Program.cs'),program);
fs.writeFileSync(path.join(directory,'NuGet.Config'),'<configuration><packageSources><clear /></packageSources></configuration>');
fs.writeFileSync(path.join(directory,'Models.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework><Nullable>enable</Nullable><ImplicitUsings>disable</ImplicitUsings><TreatWarningsAsErrors>true</TreatWarningsAsErrors></PropertyGroup></Project>');
const environment={...process.env,DOTNET_CLI_HOME:directory,DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_SKIP_FIRST_TIME_EXPERIENCE:'1',DOTNET_EnableDiagnostics:'0'};
function run(args){const result=spawnSync(process.env.DIFFORA_DOTNET_BIN||'dotnet',args,{cwd:directory,encoding:'utf8',timeout:120000,env:environment});process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');if(result.error)throw result.error;if(result.status){console.error('Compilation artifacts:',directory);process.exit(result.status);}}
if(process.env.DIFFORA_DOTNET_ROOT){
 const base=process.env.DIFFORA_DOTNET_ROOT,version=fs.readdirSync(path.join(base,'sdk')).filter(v=>v.startsWith('8.')).sort().at(-1),reference=fs.readdirSync(path.join(base,'packs/Microsoft.NETCore.App.Ref')).filter(v=>v.startsWith('8.')).sort().at(-1),refs=path.join(base,'packs/Microsoft.NETCore.App.Ref',reference,'ref/net8.0');
 const args=['-nologo','-target:exe','-nullable:enable','-warnaserror+','-out:'+path.join(directory,'Models.dll'),...fs.readdirSync(refs).filter(f=>f.endsWith('.dll')).map(f=>'-r:'+path.join(refs,f)),...fs.readdirSync(directory).filter(f=>f.endsWith('.cs')).map(f=>path.join(directory,f))];
 fs.writeFileSync(path.join(directory,'compile.rsp'),args.map(a=>'"'+a+'"').join('\n'));
 run([path.join(base,'sdk',version,'Roslyn/bincore/csc.dll'),'@'+path.join(directory,'compile.rsp')]);
 fs.writeFileSync(path.join(directory,'Models.runtimeconfig.json'),JSON.stringify({runtimeOptions:{tfm:'net8.0',framework:{name:'Microsoft.NETCore.App',version:'8.0.0'}}}));run([path.join(directory,'Models.dll')]);
}else run(['run','--project',path.join(directory,'Models.csproj'),'--configuration','Release']);
