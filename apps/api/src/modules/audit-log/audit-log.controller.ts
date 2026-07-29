import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get('stats')
  async getDashboardData(@Request() req: any) {
    // req.user comes from JwtAuthGuard
    return this.auditLogService.getMockDashboardData(req.user.userId);
  }
}
