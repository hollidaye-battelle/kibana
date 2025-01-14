# Kibana Plugin Generator

This package can be used to generate a Kibana plugin from the Kibana repo.

## Setup

Before you can use this plugin generator you must setup your [Kibana development environment](../../CONTRIBUTING.md#development-environment-setup). If you can successfully run `yarn kbn bootstrap` then you are ready to generate plugins!

## Compatibility

The plugin generator became a part of the Kibana project as of Kibana 6.3. If you are targeting versions **before Kibana 6.3** then use the [Kibana plugin sao template](https://github.com/elastic/template-kibana-plugin).

If you are targeting **Kibana 6.3 or greater** then checkout the corresponding Kibana branch and run the plugin generator.

## Quick Start

To target the current development version of Kibana just use the default  `master` branch.

```sh
node scripts/generate_plugin --name my_plugin_name -y
# generates a plugin in `plugins/my_plugin_name`
```

To target 6.8, use the `6.8` branch.

```sh
git checkout 6.x
yarn kbn bootstrap # always bootstrap when switching branches
node scripts/generate_plugin --name my_plugin_name -y
# generates a plugin for Kibana 6.8 in `../kibana-extra/my_plugin_name`
```

The generate script supports a few flags; run it with the `--help` flag to learn more.

```sh
node scripts/generate_plugin --help
```

## Updating

Since the Plugin Generator is now a part of the Kibana repo, when you update your local checkout of the Kibana repository and `bootstrap` everything should be up to date!

> ***NOTE:*** These commands should be run from the Kibana repo, and `upstream` is our convention for the git remote that references https://github.com/elastic/kibana.git, unless you added this remote you might need to use `origin`.

```sh
git pull upstream master
yarn kbn bootstrap
```

## Plugin Development Scripts

Generated plugins receive a handful of scripts that can be used during development. Those scripts are detailed in the [README.md](template/README.md) file in each newly generated plugin, and expose the scripts provided by the [Kibana plugin helpers](../kbn-plugin-helpers), but here is a quick reference in case you need it:

> ***NOTE:*** The following scripts should be run from the generated plugin root folder.

  - `yarn kbn bootstrap`

    Install dependencies and crosslink Kibana and all projects/plugins.

    > ***IMPORTANT:*** Use this script instead of `yarn` to install dependencies when switching branches, and re-run it whenever your dependencies change.

  - `yarn build`

    Build a distributable archive of your plugin.

  - `yarn dev --watch`

    Builds and starts the watch mode of your ui browser side plugin so it can be picked up by Kibana in development.


To start kibana run the following command from Kibana root.

  - `yarn start`

    Start kibana and, if you had previously run in another terminal `yarn dev --watch` at the root of your plugin, it will automatically include this plugin. You can pass any arguments that you would normally send to `bin/kibana`

      ```
      yarn start --elasticsearch.hosts http://localhost:9220
      ```

For more information about any of these commands run `yarn ${task} --help`. For a full list of tasks run `yarn run` or take a look in the `package.json` file.
