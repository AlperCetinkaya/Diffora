import {formatDialect,postgresql,transactsql} from 'sql-formatter';
export function formatSql(sql,{language,...options}){return formatDialect(sql,{...options,dialect:language==='postgresql'?postgresql:transactsql});}
