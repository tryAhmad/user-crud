import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
