# initial package installations
install.packages("devtools")
install_github('alastair-JL/AnthroTools') # needs devtools library to work.
# 
library("devtools")
library("tidyverse")


library("AnthroTools")
library("rstudioapi")

##########
# Reformat csv from odk-x default to anthotools freelisting style
##########
setwd(dirname(rstudioapi::getActiveDocumentContext()$path))

# open CSV
FL <- selectFile()

# read in CSV
FL.csv.original <- arrange(as_tibble(read.csv(FL)))

# NOTE:: CSV read in adds 'X' before '_columnName'
# filter out default columns starting with X_, age, gender
# just leave ID, location and items 
# TODO:: make sure gender is added and used
csvFilterList <- c('gender','age', 'X_form_id','X_locale','X_savepoint_type','X_savepoint_timestamp','X_savepoint_creator','X_deleted','X_data_etag_at_modification','X_default_access','X_group_modify','X_group_privileged','X_group_read_only','X_row_etag','X_row_owner')
FL.csv.filtered <- select(FL.csv.original, -c(csvFilterList))

# change columns names item_01:item_10 to 1:10
newcolnames <- c("Subj", "location", 1:10 )
colnames(FL.csv.filtered) <- newcolnames

# tidy the data into columns: id, order, item
FL.csv.tidy <- as.data.frame(gather(FL.csv.filtered, key = "Order", value = "CODE", '1':'10'))
# Convert order column to numeric
FL.csv.tidy$Order <-  as.numeric(as.character(FL.csv.tidy$Order))


######################
# AnthroTools part
# Salience Calculation
######################

FL.salience <- CalculateSalience(FL.csv.tidy)

# DealWithDoubles handles double ups in single id's choices, in case they list the same thing twice
# code after '%>%' replaces data in rows with empty strings to NA, then removes them.
# the empty strings are due to not all 10 items being filled at interview time
FL.salience.byCode <- SalienceByCode(FL.salience, dealWithDoubles = "MAX") %>%
  # recode empty strings "" by NAs
  na_if("") %>%
  # remove NAs
  na.omit


# FlowerPlot example:
par(mar=c(0,0,0,0)) # for margins
AnthroTools:::FlowerPlot(FL.salience.byCode, "Items shared:")



# Grouping of location for salience
FL.salience.grouping <- CalculateSalience(FL.csv.tidy, GROUPING = 'location')
FL.salience.villageGroup <-SalienceByCode(FL.salience.grouping, dealWithDoubles = "MAX", GROUPING= "location")
FL.salience.villageGroup <- FL.salience.villageGroup %>%
  # recode empty strings "" by NAs
  na_if("") %>%
  # remove NAs
  na.omit
