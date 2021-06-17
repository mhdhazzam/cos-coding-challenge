import {ILogger} from "../interface/ILogger";
import {injectable} from "inversify";
import  { yellow, green, red } from 'colors/safe';
import "reflect-metadata";

@injectable()
export class Logger implements ILogger {

    public constructor() {
    }


    public log(message: string): void {
        console.log(`${yellow('[LOG]')}: ${yellow(message)}`);
    }
    public error(message: string): void {
        console.log(`${red('[ERROR]')}: ${red(message)}`);
    }

    public result(message: string | number): void {
        console.log(`${green('[RESULT]')}: ${message}`);
    }

}