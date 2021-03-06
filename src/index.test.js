/* eslint-disable node/global-require */

import chalk from 'chalk';
import program from 'commander';

describe('index', () => {
	it('should setup commander with the right version', () => {
		jest.spyOn(console, 'error');
		require('./index');
		expect(program.version).toHaveBeenCalledWith(expect.any(String));
	});

	it('should register the "--dir" option', () => {
		jest.spyOn(console, 'error');
		require('./index');
		expect(program.option).toHaveBeenCalledWith(
			'-D, --dir <path>',
			expect.any(String),
			expect.any(String)
		);
	});

	it('should register the "--debug" option', () => {
		jest.spyOn(console, 'error');
		require('./index');
		expect(program.option).toHaveBeenCalledWith(
			'-d, --debug',
			expect.any(String)
		);
	});

	it('should handle unexpected config load errors gracefully', () => {
		const consoleSpy = jest.spyOn(console, 'error');
		const {onConfigLoadError} = require('./index');
		onConfigLoadError(new Error('failure'));
		expect(consoleSpy).toHaveBeenCalledWith(
			chalk.red('Unexpected error occured: failure')
		);
	});

	it('should handle empty configs gracefully', () => {
		const consoleSpy = jest.spyOn(console, 'error');
		const {onConfigLoad} = require('./index');
		onConfigLoad({config: null, filepath: 'filepath', isEmpty: true});
		expect(consoleSpy).toHaveBeenCalledWith(
			chalk.red(`Configuration file filepath is empty. Can't proceed.`)
		);
	});

	it('should handle config validation errors gracefully', () => {
		const consoleSpy = jest.spyOn(console, 'error');
		const {onConfigLoad} = require('./index');
		onConfigLoad({config: {}, filepath: 'filepath', isEmpty: false});
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining(`You have an error in your 'filepath' configuration file`)
		);
	});

	it('should set the default `private_key_path` to `~/.ssh/id_rsa`', () => {
		jest.spyOn(console, 'error');
		const {onConfigLoad} = require('./index');
		const config = {
			host: '1.1.1.1',
			target_dir: '/var/www/html',
		};
		const result = onConfigLoad({config, filepath: 'filepath', isEmpty: false});
		expect(result.config.private_key_path).toContain('.ssh/id_rsa');
	});

	it('should set the default `user` to `root`', () => {
		jest.spyOn(console, 'error');
		const {onConfigLoad} = require('./index');
		const config = {
			host: '1.1.1.1',
			target_dir: '/var/www/html',
		};
		const result = onConfigLoad({config, filepath: 'filepath', isEmpty: false});
		expect(result.config.user).toContain('root');
	});

	it('should expect a valid command if given a valid configuration file', () => {
		const consoleSpy = jest.spyOn(console, 'error');
		const {onConfigLoad} = require('./index');
		const config = {
			host: '24.1.2.3',
			target_dir: '/var/www/',
		};
		onConfigLoad({config, filepath: 'filepath', isEmpty: false});
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining(`No commands specified.`)
		);
	});
});
