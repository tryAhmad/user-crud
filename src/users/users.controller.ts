import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorators';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  //these api response and operations are only shown in the swagger documentation
  @ApiOperation({ summary: 'Creates a new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been created successfully',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      return {
        message: 'User with this email already exists',
      };
    }
    const user = await this.usersService.createUser(createUserDto);
    return {
      message: 'User created successfully',
      user,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin) // Only Admin can access this route
  @ApiOperation({ summary: 'Retrieves all users' })
  @ApiResponse({
    status: 200,
    description: 'Users have been retrieved successfully',
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      message: 'Users retrieved successfully',
      users,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieves all users with passwords (AuthGuard)' })
  @ApiResponse({
    status: 200,
    description: 'Users with passwords have been retrieved successfully',
  })
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    console.log('Decoded user from token:', req.user);
    const user = await this.usersService.getUserProfile(userId);
    return {
      message: 'User profile retrieved successfully',
      user,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      message: 'User retrieved successfully',
      user,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been updated successfully',
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      message: `User(${id}) updated successfully`,
      user,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been removed successfully',
  })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return {
      message: `User(${id}) removed successfully`,
      user,
    };
  }
}
