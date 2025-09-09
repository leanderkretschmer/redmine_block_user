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

  # Runtime dependencies
  # Note: Rails and other core dependencies are provided by Redmine
  # Only add plugin-specific runtime dependencies here if needed
  
  # Development dependencies are handled by the main Redmine installation
  # Uncomment and modify these only if you need specific versions for development
  # s.add_development_dependency "rspec-rails"
  # s.add_development_dependency "factory_bot_rails"
end