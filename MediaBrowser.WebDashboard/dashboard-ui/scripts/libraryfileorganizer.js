﻿(function ($, document, window) {
    
    function updateSeasonPatternHelp(page, value) {
        
        var replacementHtmlResult = 'Result: ' + value.replace('%s', '1').replace('%0s', '01').replace('%00s', '001');

        $('.seasonFolderFieldDescription', page).html(replacementHtmlResult);
    }

    function updateEpisodePatternHelp(page, value) {

        var seriesName = "Series Name";
        var episodeTitle = "Episode Four";
        
        value = value.replace('%sn', seriesName)
            .replace('%s.n', seriesName.replace(' ', '.'))
            .replace('%s_n', seriesName.replace(' ', '_'))
            .replace('%s', '1')
            .replace('%0s', '01')
            .replace('%00s', '001')
            .replace('%ext', 'mkv')
            .replace('%en', episodeTitle)
            .replace('%e.n', episodeTitle.replace(' ', '.'))
            .replace('%e_n', episodeTitle.replace(' ', '_'))
            .replace('%e', '4')
            .replace('%0e', '04')
            .replace('%00e', '004');
        
        var replacementHtmlResult = 'Result: ' + value;

        $('.episodePatternDescription', page).html(replacementHtmlResult);
    }

    function loadPage(page, config) {

        var tvOptions = config.TvFileOrganizationOptions;

        $('#chkEnableTvSorting', page).checked(tvOptions.IsEnabled).checkboxradio('refresh');
        $('#chkOverwriteExistingEpisodes', page).checked(tvOptions.OverwriteExistingEpisodes).checkboxradio('refresh');
        $('#chkDeleteEmptyFolders', page).checked(tvOptions.DeleteEmptyFolders).checkboxradio('refresh');
        $('#chkEnableTrialMode', page).checked(tvOptions.EnableTrialMode).checkboxradio('refresh');

        $('#txtMinFileSize', page).val(tvOptions.MinFileSizeMb);
        $('#txtSeasonFolderPattern', page).val(tvOptions.SeasonFolderPattern).trigger('change');
        $('#txtSeasonZeroName', page).val(tvOptions.SeasonZeroFolderName);
        $('#txtWatchFolder', page).val(tvOptions.WatchLocations[0] || '');

        $('#txtEpisodePattern', page).val(tvOptions.EpisodeNamePattern).trigger('change');
    }
    
    $(document).on('pageinit', "#libraryFileOrganizerPage", function () {

        var page = this;

        $('#txtSeasonFolderPattern', page).on('change keypress', function() {

            updateSeasonPatternHelp(page, this.value);

        });

        $('#txtEpisodePattern', page).on('change keypress', function () {

            updateEpisodePatternHelp(page, this.value);

        });

        $('#btnSelectWatchFolder', page).on("click.selectDirectory", function () {

            var picker = new DirectoryBrowser(page);

            picker.show({

                callback: function (path) {

                    if (path) {
                        $('#txtWatchFolder', page).val(path);
                    }
                    picker.close();
                },

                header: "Select Watch Folder",

                instruction: "Browse or enter the path to your watch folder. The folder must be writeable."
            });
        });

    }).on('pageshow', "#libraryFileOrganizerPage", function () {

        var page = this;

        ApiClient.getServerConfiguration().done(function (config) {
            loadPage(page, config);
        });
    });

    window.LibraryFileOrganizerPage = {
      
        onSubmit: function() {

            var form = this;

            ApiClient.getServerConfiguration().done(function (config) {
                
                var tvOptions = config.TvFileOrganizationOptions;

                tvOptions.IsEnabled = $('#chkEnableTvSorting', form).checked();
                tvOptions.OverwriteExistingEpisodes = $('#chkOverwriteExistingEpisodes', form).checked();
                tvOptions.DeleteEmptyFolders = $('#chkDeleteEmptyFolders', form).checked();
                tvOptions.EnableTrialMode = $('#chkEnableTrialMode', form).checked();

                tvOptions.MinFileSizeMb = $('#txtMinFileSize', form).val();
                tvOptions.SeasonFolderPattern = $('#txtSeasonFolderPattern', form).val();
                tvOptions.SeasonZeroFolderName = $('#txtSeasonZeroName', form).val();

                tvOptions.EpisodeNamePattern = $('#txtEpisodePattern', form).val();

                var watchLocation = $('#txtWatchFolder', form).val();
                tvOptions.WatchLocations = watchLocation ? [watchLocation] : [];

                ApiClient.updateServerConfiguration(config).done(Dashboard.processServerConfigurationUpdateResult);
            });

            return false;
        }

    };

})(jQuery, document, window);