import { Controller, Get } from '@nestjs/common';
import { join } from 'path';

@Controller()
export class AppController {
  @Get('*')
  sendIndex(req: any, res: { sendFile: (arg0: string) => void }) {
    res.sendFile(join(__dirname, 'client', 'index.html'));
  }
}
// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }
