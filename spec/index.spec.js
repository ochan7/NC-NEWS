process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const { expect } = require('chai');
const request = require('supertest');
const saveTestData = require('../seed/test.seed');
const app = require('../server');