# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)

Gem::Specification.new do |s|
  s.name        = "redmine_block_user"
  s.version     = "1.0.0"
  s.authors     = ["Your Name"]
  s.email       = ["your.email@example.com"]
  s.homepage    = "https://github.com/yourusername/redmine_block_user"
  s.summary     = "Redmine plugin to block/delete users from specific tickets"
  s.description = "A Redmine 6 plugin that allows blocking/deleting users from specific tickets via comment actions"
  s.license     = "MIT"

  s.files = Dir["{app,config,lib,assets}/**/*"] + ["init.rb", "README.md"]
  s.require_paths = ["lib"]

  s.add_dependency "rails", ">= 7.0"
  
  s.add_development_dependency "rspec-rails"
  s.add_development_dependency "factory_bot_rails"
  s.add_development_dependency "capybara"
  s.add_development_dependency "selenium-webdriver"
end